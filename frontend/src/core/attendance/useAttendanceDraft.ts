import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import {
  useAddSiteWorker,
  useCreateAttendanceDay,
  useGetAttendanceDay,
  useListSiteWorkers,
  useUpdateAttendanceDay,
} from '@/core/api/generated/attendance/attendance'
import type { CreateWorkerRequest } from '@/core/api/generated/model'
import { buildDraft, CAME, countMarks, toRequest, type AttendanceMark, type DraftRow } from '@/core/attendance/attendanceDraft'
import { todayIsoDate } from '@/core/format/dates'

/** Yoklama sorgularının anahtarında "attendance" ya da "workers" geçer; kayıttan sonra hepsi yenilenir. */
export function useAttendanceRefresh() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.some((part) => part === 'attendance' || part === 'workers'),
    })
}

/** Şantiyenin personeli ve o günün kaydı; pencere kapalıyken (open false) hiçbir şey çekilmez. */
function useAttendanceSources(siteId: MaybeRefOrGetter<string>, day: MaybeRefOrGetter<string>,
  open: MaybeRefOrGetter<boolean>) {
  const enabled = computed(() => toValue(open))
  const workers = useListSiteWorkers(siteId, { query: { enabled } })
  const recorded = useGetAttendanceDay(siteId, day, { query: { enabled } })
  return {
    workers,
    recorded,
    isLoading: computed(() => workers.isPending.value || recorded.isPending.value),
    isRecorded: computed(() => !!recorded.data.value?.recordedAt),
  }
}

/** Personel ekleme ve günü kaydetme: alınmışsa düzenlenir, alınmamışsa oluşturulur; sonra her şey yenilenir. */
function useAttendanceWrites(siteId: MaybeRefOrGetter<string>, day: MaybeRefOrGetter<string>) {
  const refresh = useAttendanceRefresh()
  const add = useAddSiteWorker()
  const create = useCreateAttendanceDay()
  const update = useUpdateAttendanceDay()

  async function saveDay(rows: DraftRow[], alreadyRecorded: boolean) {
    const variables = { siteId: toValue(siteId), day: toValue(day), data: toRequest(rows) }
    await (alreadyRecorded ? update : create).mutateAsync(variables)
    await refresh()
  }

  return {
    addWorker: (form: CreateWorkerRequest) => add.mutateAsync({ siteId: toValue(siteId), data: form }),
    saveDay,
    isSaving: computed(() => add.isPending.value || create.isPending.value || update.isPending.value),
  }
}

/**
 * Bir şantiyenin bir günlük yoklama penceresi: liste (herkes varsayılan "Geldi"), kişi işaretleme, personel
 * ekleme, kaydetme. O gün yoklama zaten alınmışsa (isRecorded) aynı liste düzenlenir; ikinci yoklama açılmaz.
 */
export function useAttendanceDraft(siteId: MaybeRefOrGetter<string>, day: MaybeRefOrGetter<string>,
  open: MaybeRefOrGetter<boolean>) {
  const { workers, recorded, isLoading, isRecorded } = useAttendanceSources(siteId, day, open)
  const writes = useAttendanceWrites(siteId, day)
  const rows = ref<DraftRow[]>([])

  /** current: pencerede o ana kadar yapılan işaretler; veri yenilense de korunur. */
  function rebuild(current: DraftRow[]) {
    const entries = recorded.data.value?.entries ?? []
    const withRoster = toValue(day) === todayIsoDate()
    rows.value = buildDraft({ workers: workers.data.value ?? [], recorded: entries, current, withRoster })
  }
  watch([workers.data, recorded.data], () => rebuild(rows.value), { immediate: true })

  function mark(workerId: string, next: AttendanceMark) {
    rows.value = rows.value.map((row) => (row.worker.id === workerId ? { ...row, mark: next } : row))
  }

  return {
    rows,
    counts: computed(() => countMarks(rows.value.map((row) => row.mark))),
    isLoading,
    isRecorded,
    isSaving: writes.isSaving,
    mark,
    /** Yeni kişi hemen kaydedilir ve listeye "Geldi" olarak girer. */
    addWorker: async (form: CreateWorkerRequest) => rebuild([...rows.value, { worker: await writes.addWorker(form), mark: CAME }]),
    save: () => writes.saveDay(rows.value, isRecorded.value),
    /** Pencere yeniden açılınca kaydedilmemiş işaretler atılır, liste veriden baştan kurulur. */
    reset: () => rebuild([]),
  }
}
