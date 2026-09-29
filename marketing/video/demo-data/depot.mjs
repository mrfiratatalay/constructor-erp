/**
 * Kızılkan Yapı'nın deposu: malzemeler, dış firmalar ve son 45 günün sevkiyatları. Firmalar hayalidir. Hikâyesi:
 * depoya demir, çimento, tuğla gelir; şantiyelere gider; bir müteahhide verilen çelik kalıplar 40 gündür dönmedi,
 * iskele boruları iş karşılığı Recep Usta'da; bir sevkiyat yanlış şantiye seçildiği için iptal edildi.
 * day: bugünden kaç gün önce. Çekimde depocu bugünün sevkiyatını telefondan kendisi girer.
 */
export const MATERIALS = [
  { key: 'cimento', name: 'Çimento', unit: 'Torba' },
  { key: 'demir', name: 'İnşaat demiri Ø12', unit: 'Ton' },
  { key: 'tugla', name: 'Tuğla', unit: 'Adet' },
  { key: 'kum', name: 'Kum', unit: 'm³' },
  { key: 'kalip', name: 'Çelik kalıp', unit: 'Adet' },
  { key: 'iskele', name: 'İskele borusu', unit: 'Adet' },
  { key: 'yapistirici', name: 'Seramik yapıştırıcı', unit: 'Torba' },
  { key: 'kablo', name: 'Elektrik kablosu 3x2,5', unit: 'Metre' },
  { key: 'alci', name: 'Saten alçı', unit: 'Torba' },
  { key: 'boru', name: 'PVC boru Ø100', unit: 'Metre' },
]

const line = (material, quantity) => ({ material, quantity })

/** to: şantiye anahtarı (world.mjs), OUTSIDE (dış firmaya) ya da INBOUND (depoya geldi). */
export const SHIPMENTS = [
  { day: 45, to: 'INBOUND', party: 'Özgür Kalıp Ticaret', lines: [line('kalip', 200), line('iskele', 400)] },
  { day: 40, to: 'OUTSIDE', party: 'Aydın İnşaat', expectsReturn: true, lines: [line('kalip', 50)], description: 'Temel işi için ödünç, Aydın Bey' },
  { day: 32, to: 'INBOUND', party: 'Doğan Demir Ticaret', lines: [line('demir', 24)] },
  { day: 26, to: 'INBOUND', party: 'Yılmaz Yapı Market', lines: [line('cimento', 800), line('yapistirici', 150), line('alci', 120)] },
  { day: 24, to: 'INBOUND', party: 'Anadolu Tuğla', lines: [line('tugla', 12000)] },
  { day: 21, to: 'kartal', lines: [line('cimento', 150), line('kum', 12)] },
  { day: 19, to: 'INBOUND', party: 'Yılmaz Yapı Market', lines: [line('kum', 40), line('kablo', 1500), line('boru', 300)] },
  { day: 16, to: 'atasehir', lines: [line('demir', 6), line('kalip', 60)] },
  { day: 14, to: 'OUTSIDE', party: 'Recep Usta', expectsReturn: true, lines: [line('iskele', 120)], description: 'İş karşılığı, Recep Usta' },
  { day: 12, to: 'beylikduzu', lines: [line('tugla', 4000), line('cimento', 90)] },
  { day: 9, to: 'cekmekoy', lines: [line('yapistirici', 60), line('alci', 40)], cancel: 'Yanlış şantiye seçildi, Beylikdüzü olacaktı.' },
  { day: 9, to: 'beylikduzu', lines: [line('yapistirici', 60), line('alci', 40)] },
  { day: 7, to: 'kartal', lines: [line('demir', 8), line('cimento', 120)] },
  { day: 5, to: 'atasehir', lines: [line('kablo', 600), line('boru', 80)] },
  { day: 3, to: 'cekmekoy', lines: [line('tugla', 3500), line('kum', 10)] },
  { day: 2, to: 'kartal', lines: [line('iskele', 90), line('kalip', 40)] },
  { day: 1, to: 'atasehir', lines: [line('cimento', 100), line('alci', 30)] },
]

/** Çekimde depocunun telefondan gireceği bugünün sevkiyatı (seed girmez). */
export const TODAY_SHIPMENT = { to: 'kartal', lines: [line('cimento', 50), line('demir', 2)] }
