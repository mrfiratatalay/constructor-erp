import type { PostView } from '@/core/api/generated/model'

/** Saha satırının simgesi: ✓ yapıldı, ↻ devam ediyor, 📦 teslimat, ! sorun, · düz not. */
export type FieldKind = 'issue' | 'done' | 'progress' | 'delivery' | 'note'

/**
 * Tür kullanıcıya seçtirilmez (TASARIM.md "Saha"): adam zaten "Tuğla geldi", "Beton bitti" diye yazıyor, aynı
 * şeyi bir de düğmeyle söyletmeyiz. Simge yazının kendisinden okunur. Tam kelime aranır: "gelmedi" "geldi"
 * sayılmaz. Sıra önemlidir: "Tuğla geldi, dizmeye başladık" bir teslimattır.
 */
const KIND_WORDS: ReadonlyArray<[FieldKind, ReadonlySet<string>]> = [
  ['done', new Set(['tamamlandı', 'tamamlandi', 'tamamladık', 'bitti', 'bitirildi', 'bitirdik', 'döküldü', 'yapıldı',
    'kuruldu', 'tamam'])],
  ['delivery', new Set(['geldi', 'teslim', 'teslimat', 'teslimatı', 'ulaştı', 'indirildi', 'boşaltıldı', 'sevkiyat'])],
  ['progress', new Set(['devam', 'sürüyor', 'başladı', 'başladık', 'başlandı', 'yapılıyor'])],
]

function wordsOf(text: string): string[] {
  return text.toLocaleLowerCase('tr').split(/[^\p{L}\p{N}]+/u)
}

/** Yalnızca sorun ayrıca işaretlenir ("Sorun bildir"): patronun dikkatine çıkması gerçekten değerlidir. */
export function fieldKind(post: Pick<PostView, 'issue' | 'body'>): FieldKind {
  if (post.issue) return 'issue'
  const words = wordsOf(post.body ?? '')
  return KIND_WORDS.find(([, known]) => words.some((word) => known.has(word)))?.[0] ?? 'note'
}
