/** Günün saatine göre selam: sabah açan patron "Günaydın" görür. */
export function greeting(now: Date = new Date()): string {
  const hour = now.getHours()
  if (hour < 11) return 'Günaydın'
  if (hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}
