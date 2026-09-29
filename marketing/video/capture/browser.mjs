import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { OWNER } from '../demo-data/world.mjs'

/**
 * Çekimlerin ortak tarayıcısı. Telefon 3x, masaüstü 2x çözünürlükte çekilir: videoda kamera ekrana yaklaştığında
 * görüntü bulanıklaşmasın. Telefon kurulu uygulama gibi tam ekrandır (393×852, iPhone 15); üstteki saat çubuğu
 * (54) ile alttaki ev çizgisi payını (34) videonun telefon çerçevesi çizer, uygulama aradaki 393×764'e sığar.
 */
export const APP = process.env.DEMO_APP ?? 'http://127.0.0.1:5173'
export const ids = JSON.parse(readFileSync(new URL('../demo-data/.ids.json', import.meta.url)))

const PHONE = {
  viewport: { width: 393, height: 764 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
}
const DESKTOP = { viewport: { width: 1470, height: 920 }, deviceScaleFactor: 2 }

export async function launch() {
  // Bulut ortamında Playwright'ın kendi Chromium'u önceden kurulu; yerelde PLAYWRIGHT_CHROMIUM verilmezse indirileni kullanır.
  return chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM })
}

/**
 * kind: 'phone' ya da 'desktop'. who: 'owner', .ids.json'daki kişi anahtarı ('ahmet') ya da null: hiç girmemiş bir
 * telefon (firmanın bağlantısını ilk kez açan yeni usta gibi).
 */
export async function openAs(browser, kind, who) {
  const device = kind === 'phone' ? PHONE : DESKTOP
  const context = await browser.newContext({
    ...device,
    baseURL: APP,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    reducedMotion: 'no-preference',
  })
  if (who !== null) await signIn(context, who)
  // Bağlantı "Kopyala" düğmesi panoya yazar; tarayıcı izin vermezse sessizce başarısız olur.
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP })
  const page = await context.newPage()
  return { context, page }
}

async function signIn(context, who) {
  const api = context.request
  const owner = await api.post('/api/auth/login', { data: { email: OWNER.email, password: OWNER.password } })
  if (!owner.ok()) throw new Error(`Patron girişi olmadı: ${owner.status()}`)
  if (who === 'owner') return
  // Patron kişiye giriş linki üretir, kişi linki açar: uygulamadaki "Giriş linki gönder" yolunun aynısı.
  const link = await (await api.post(`/api/team/members/${ids.people[who]}/login-link`)).json()
  const token = link.url.slice(link.url.lastIndexOf('/') + 1)
  const accepted = await api.post('/api/auth/invites/accept', { data: { token } })
  if (!accepted.ok()) throw new Error(`${who} girişi olmadı: ${accepted.status()}`)
}
