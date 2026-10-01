/** Tanıtımda özel firma verisi kullanılmaz; bu kayıtlar örnek çalışma alanına aittir. */
export type PreviewView = 'field' | 'attendance' | 'materials'
export const PREVIEW_TABS: readonly { value: PreviewView; label: string }[] = [
  { value: 'field', label: 'Saha' },
  { value: 'attendance', label: 'Yoklama' },
  { value: 'materials', label: 'Malzemeler' },
]
export const PREVIEW_FIELD = [
  { time: '14:20', title: '2. kat kolon kalıpları tamamlandı.', author: 'Ayşe · Şantiye şefi', kind: 'done' },
  { time: '11:05', title: 'İnşaat demiri şantiyeye teslim edildi.', author: 'Mehmet · Depo sorumlusu', kind: 'delivery' },
  { time: '09:40', title: 'Beton pompasının geliş saati bekleniyor.', author: 'Ayşe · Şantiye şefi', kind: 'issue' },
] as const
export const PREVIEW_ATTENDANCE = [
  { initials: 'AY', name: 'Ali Yılmaz', trade: 'Kalıp ustası', status: 'Geldi', tone: 'present' },
  { initials: 'MD', name: 'Murat Demir', trade: 'Demir ustası', status: 'Geldi', tone: 'present' },
  { initials: 'EK', name: 'Emre Kaya', trade: 'Elektrik ustası', status: 'İzinli', tone: 'leave' },
] as const
export const PREVIEW_MATERIALS = [
  { reference: 'SV-000128', title: 'Şantiyeye gönderim', route: 'Ana depo → Park Konutları', quantity: '24 adet kalıp paneli', state: 'Geri bekleniyor' },
  { reference: 'SV-000127', title: 'Depoya giriş', route: 'Tedarikçi → Ana depo', quantity: '120 torba çimento', state: 'Tamamlandı' },
  { reference: 'SV-000126', title: 'Malzeme iadesi', route: 'Park Konutları → Ana depo', quantity: '8 adet kalıp paneli', state: 'Tamamlandı' },
] as const
