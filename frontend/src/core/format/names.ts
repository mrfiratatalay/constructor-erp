/** "Ahmet Yılmaz" → "Ahmet": listelerde ve önizlemede kısa ad yeter. */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}
