/**
 * Kartal Konutları B Blok'un İlerleme sekmesi: bir konut bloğunun eylül sonu hâli. Temel ağustosta bitti, karkas
 * demiri yarıyı geçmek üzere (videonun kahramanı: şef bugün +3,5 ton girer, 58,5 → 62 / 120 ton), alt katlarda ince
 * işler başladı, bodrum tesisatı planlanan tarihi geçti. Her durum bir kez görünür: Tamamlandı, Devam ediyor,
 * Bitmeye yakın, Gecikiyor.
 *
 * Miktarlar sabittir, günler dünden geriye doğru iş günlerine (Pazar hariç) yerleşir; ay kısa da olsa sayılar aynı
 * kalır. Yağmur günü (puantajdaki gün) yalnızca demirde yarım gün girişi vardır, ötekiler o gün çalışmamıştır.
 * plannedEnd bugünden gün farkıdır; temelin tarihleri kendi girişlerinden çıkar.
 */
export const PROGRESS_SITE = 'kartal'
export const TODAY_ENTRY = { item: 'demir', quantity: '3,5', workers: '12' }

/** Geciken işin son girişinde şefin notu: patron detayda "neden" sorusunun cevabını okur. Kalan 1.200 - 980. */
export const DELAY_NOTE = 'Yangın hattı boruları tedarikçiden üç gün geç geldi. Kalan 220 metre, bir haftalık iş.'

const cycle = (values, count) => Array.from({ length: count }, (_, index) => values[index % values.length])

export const ITEMS = [
  {
    key: 'temel',
    trade: 'Demir İşleri',
    title: 'Temel Demiri',
    crew: 'Hasan Usta',
    total: 85,
    unit: 'ton',
    beforeMonth: true,
    amounts: [...cycle([6, 6.5, 5.5, 6.5, 5.5, 6], 13), 7],
    workers: [14, 15, 16],
    note: 'Radye temel donatısı, 85 ton.',
  },
  {
    key: 'demir',
    trade: 'Demir İşleri',
    crew: 'Hasan Usta',
    total: 120,
    unit: 'ton',
    plannedEnd: 46,
    amounts: [...cycle([2, 2.5, 3, 2, 2.5, 2.5], 23), 2],
    rain: { quantity: 1, note: 'Yağmur: öğleden sonra paydos' },
    workers: [11, 12, 12, 10, 12, 13],
    note: 'Karkas donatısı: zemin + 9 kat, katta ~12 ton.',
    floors: true,
  },
  {
    key: 'elektrik',
    trade: 'Elektrik',
    title: 'Elektrik Boruları · 1-4. Kat',
    crew: 'Volkan Usta',
    total: 16,
    unit: 'daire',
    plannedEnd: 9,
    amounts: cycle([1], 15),
    workers: [4, 4, 5],
  },
  {
    key: 'bodrum',
    trade: 'Mekanik',
    title: 'Bodrum Tesisatı',
    crew: 'Erdal Usta',
    total: 1200,
    unit: 'metre',
    plannedEnd: -5,
    amounts: cycle([45, 50, 55, 40, 50, 55], 20),
    workers: [5, 6, 6, 5],
    notes: { 19: DELAY_NOTE },
  },
  {
    key: 'alci',
    trade: 'Alçı',
    title: 'Alçı Sıva · 1-2. Kat',
    crew: 'Kadir Usta',
    total: 1100,
    unit: 'm²',
    plannedEnd: 16,
    amounts: [40, 45, 50, 45, 50, 55, 45, 50],
    workers: [7, 8, 8],
  },
]

/** Demirin kat notları: gerçekleşen her 12 tonda bir kat biter. */
export const FLOOR_TONS = 12
export const floorName = (index) => (index === 0 ? 'Zemin kat' : `${index}. kat`)
export const POUR_NOTE = 'Beton dökümü: döşeme donatısı kontrol edildi, teslim.'
