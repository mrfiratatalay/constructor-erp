/**
 * Görevin simgesi başlığından okunur (Saha'daki güncelleme simgesi gibi): kullanıcıya tür seçtirilmez, görevde
 * yeni bir alan yoktur. "3. Kat Elektrik" ⚡, "Banyo tesisatı" 🚿, "Tuğla duvar" 🧱, "İç cephe boya" 🎨.
 */
const ICONS: { icon: string; words: string[] }[] = [
  { icon: '🚿', words: ['banyo', 'tesisat', 'sıhhi', 'lavabo', 'duş'] },
  { icon: '⚡', words: ['elektrik', 'kablo', 'priz', 'aydınlatma', 'pano'] },
  { icon: '🧱', words: ['duvar', 'tuğla', 'briket', 'sıva', 'örgü'] },
  { icon: '🎨', words: ['boya', 'badana', 'alçı'] },
]

export function taskIcon(title: string): string {
  const text = title.toLocaleLowerCase('tr')
  return ICONS.find((entry) => entry.words.some((word) => text.includes(word)))?.icon ?? '📋'
}

/** "⚡ 3. Kat Elektrik": listede, teslim kartında ve pencerelerde işin adı böyle yazar. */
export function taskName(title: string): string {
  return `${taskIcon(title)} ${title}`
}
