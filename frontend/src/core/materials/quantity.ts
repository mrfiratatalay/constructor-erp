const QUANTITY = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 })

/** Türkçe miktar: binlik nokta, ondalık virgül, gereksiz sıfır yok ("1.850", "2,4"). */
export const formatQuantity = (value: number) => QUANTITY.format(value)

export const withUnit = (value: number, unit: string) => `${formatQuantity(value)} ${unit}`

/** Okunur hareket numarası; sayı değişmez, kimlikten ayrıdır. */
export const movementNumber = (value: number) => `MH-${String(value).padStart(6, '0')}`
