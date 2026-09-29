/** İmalat türünün simgesi için kaba sınıfı; kullanıcıya seçtirilmez, türün adından okunur (Saha'daki gibi). */
export type TradeKind =
  | 'rebar'
  | 'formwork'
  | 'masonry'
  | 'plaster'
  | 'tile'
  | 'paint'
  | 'electric'
  | 'mechanical'
  | 'insulation'
  | 'other'

/** Sıra önemlidir: "Alçı sıva" sıvadır; ilk eşleşen kazanır. Kelimenin başı aranır: "Demir İşleri" → demir. */
const TRADE_WORDS: ReadonlyArray<[TradeKind, readonly string[]]> = [
  ['rebar', ['demir', 'donatı', 'çelik']],
  ['formwork', ['kalıp']],
  ['masonry', ['duvar', 'tuğla', 'briket', 'gazbeton']],
  ['plaster', ['sıva', 'alçı', 'şap']],
  ['tile', ['seramik', 'fayans', 'parke', 'mermer']],
  ['paint', ['boya', 'badana']],
  ['electric', ['elektrik', 'kablo', 'aydınlatma']],
  ['mechanical', ['mekanik', 'tesisat', 'sıhhi', 'klima', 'asansör', 'doğalgaz']],
  ['insulation', ['mantolama', 'yalıtım', 'izolasyon']],
]

export function tradeKind(trade: string): TradeKind {
  const words = trade.toLocaleLowerCase('tr').split(/[^\p{L}]+/u)
  const found = TRADE_WORDS.find(([, starts]) =>
    words.some((word) => starts.some((s) => word.startsWith(s))),
  )
  return found?.[0] ?? 'other'
}
