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
 * Pencerenin listesi. Yalnızca bu pencerede elle yapılan işaretler (ve eklenen kişiler) ayrıca tutulur: personel
 * ile günün kaydı hangi sırayla gelirse gelsin dokunulmamış herkes kayıttaki hâlini alır, dokunulan korunur.
 */
function useDraftRows(sources: ReturnType<typeof useAttendanceSources>, day: MaybeRefOrGetter<string>) {
  const rows = ref<DraftRow[]>([])
  const touched = ref<DraftRow[]>([])

  function rebuild() {
    const recorded = sources.recorded.data.value?.entries ?? []
    const withRoster = toValue(day) === todayIsoDate()
    rows.value = buildDraft({ workers: sources.workers.data.value ?? [], recorded, current: touched.value, withRoster })
  }
  watch([sources.workers.data, sources.recorded.data], rebuild, { immediate: true })

  function remember(row: DraftRow) {
    touched.value = [...touched.value.filter((item) => item.worker.id !== row.worker.id), row]
    rebuild()
  }

  function mark(workerId: string, next: AttendanceMark) {
    const row = rows.value.find((item) => item.worker.id === workerId)
    if (row) remember({ ...row, mark: next })
  }

  function reset() {
    touched.value = []
    rebuild()
  }

  return { rows, remember, mark, reset }
}

/**
 * Bir şantiyenin bir günlük yoklama penceresi: liste (herkes varsayılan "Geldi"), kişi işaretleme, personel
 * ekleme, kaydetme. O gün yoklama zaten alınmışsa (isRecorded) aynı liste düzenlenir; ikinci yoklama açılmaz.
 */
export function useAttendanceDraft(siteId: MaybeRefOrGetter<string>, day: MaybeRefOrGetter<string>,
  open: MaybeRefOrGetter<boolean>) {
  const sources = useAttendanceSources(siteId, day, open)
  const writes = useAttendanceWrites(siteId, day)
  const draft = useDraftRows(sources, day)

  return {
    rows: draft.rows,
    counts: computed(() => countMarks(draft.rows.value.map((row) => row.mark))),
    isLoading: sources.isLoading,
    isRecorded: sources.isRecorded,
    isSaving: writes.isSaving,
    mark: draft.mark,
    /** Yeni kişi hemen kaydedilir ve listeye "Geldi" olarak girer. */
    addWorker: async (form: CreateWorkerRequest) => draft.remember({ worker: await writes.addWorker(form), mark: CAME }),
    save: () => writes.saveDay(draft.rows.value, sources.isRecorded.value),
    /** Pencere yeniden açılınca kaydedilmemiş işaretler atılır, liste veriden baştan kurulur. */
    reset: draft.reset,
  }
}
