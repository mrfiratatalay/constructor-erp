import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref, type Ref } from 'vue'
import {
  getGetDailyAttendanceQueryKey,
  useAddSiteWorker,
  useGetDailyAttendance,
  useSaveDailyAttendance,
} from '@/core/api/generated/attendance/attendance'
import type { CreateWorkerRequest, SiteAttendanceEntries } from '@/core/api/generated/model'
import { CAME, countMarks } from '@/core/attendance/attendanceDraft'
import { buildRoll, pendingSites, quickMark, splitRoll, type QuickChoice, type RollRow } from '@/core/attendance/dailyRoll'
import { useAttendanceRefresh } from '@/core/attendance/useAttendanceDraft'
import { todayIsoDate } from '@/core/format/dates'

/** Personel ekleme ve kaydetme; kayıttan sonra ekran hemen cevaptaki listeyi gösterir, öteki yoklama ekranları yenilenir. */
function useDailyWrites(day: string, touched: Ref<RollRow[]>) {
  const queryClient = useQueryClient()
  const refresh = useAttendanceRefresh()
  const add = useAddSiteWorker()
  const saveAll = useSaveDailyAttendance()

  async function save(sites: SiteAttendanceEntries[]) {
    if (!sites.length) return
    const sheets = await saveAll.mutateAsync({ day, data: { sites } })
    queryClient.setQueryData(getGetDailyAttendanceQueryKey(day), sheets)
    touched.value = []
    await refresh()
  }

  async function addWorker(siteId: string, form: CreateWorkerRequest) {
    const worker = await add.mutateAsync({ siteId, data: form })
    await refresh()
    return worker
  }

  return { save, addWorker, isSaving: computed(() => add.isPending.value || saveAll.isPending.value) }
}

/**
 * Yoklama ekranı: bugünün personel listesi, şantiye seçmeden (bütün aktif şantiyeler tek listede). Kişiye dokununca
 * işareti yalnızca ekranda değişir; "Yoklamayı Kaydet" değişen ya da henüz alınmamış şantiyelerin hepsini tek
 * seferde yazar. Eklenen kişi listeye "Geldi" olarak girer.
 */
export function useDailyAttendance() {
  const day = todayIsoDate()
  const query = useGetDailyAttendance(day)
  const sheets = computed(() => query.data.value ?? [])
  const touched = ref<RollRow[]>([])
  const rows = computed(() => buildRoll(sheets.value, touched.value))
  const pending = computed(() => pendingSites(sheets.value, rows.value, touched.value))
  const writes = useDailyWrites(day, touched)
  const siteName = (siteId: string) => sheets.value.find((sheet) => sheet.siteId === siteId)?.siteName ?? ''
  const remember = (row: RollRow) => {
    touched.value = [...touched.value.filter((item) => item.worker.id !== row.worker.id), row]
  }

  return {
    day,
    rows,
    groups: computed(() => splitRoll(rows.value)),
    counts: computed(() => countMarks(rows.value.map((row) => row.mark))),
    sites: computed(() => sheets.value.map((sheet) => ({ id: sheet.siteId, name: sheet.siteName }))),
    isLoading: query.isPending,
    isSaving: writes.isSaving,
    /** Kaydedilecek bir şey kalmadı: listedeki herkes bugünün kaydında ve ekranda değişiklik yok. */
    isSaved: computed(() => rows.value.length > 0 && pending.value.length === 0),
    mark: (row: RollRow, choice: QuickChoice) => remember({ ...row, mark: quickMark(choice, row.mark.note) }),
    addWorker: async (siteId: string, form: CreateWorkerRequest) =>
      remember({ worker: await writes.addWorker(siteId, form), mark: CAME, siteId, siteName: siteName(siteId) }),
    save: () => writes.save(pending.value),
  }
}
