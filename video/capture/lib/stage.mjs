// Çekim sahnesi: kimin gözünden (oturum çerezi), hangi cihazda (masaüstü 1440×900 @2x, telefon 390×844 @3x),
// hangi saatte. Çekim katmanı (inject/stage.js) her sayfaya yüklenmeden önce eklenir.
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { launch } from '../../tools/browser.mjs'
import { Session } from '../../demo/seed/api.mjs'
import { offsetSeconds } from '../../demo/seed/clock.mjs'
import { ADMIN } from '../../demo/seed/onboard.mjs'

const STAGE_SCRIPT = fileURLToPath(new URL('../inject/stage.js', import.meta.url))
const SESSIONS = fileURLToPath(new URL('../../out/sessions.json', import.meta.url))
export const BASE = 'http://localhost:5173'

export const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  phone: {
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  },
}

async function sessionCookie(person) {
  if (person !== 'admin') return JSON.parse(await readFile(SESSIONS, 'utf8')).cookies[person]
  const admin = await new Session('admin').login(ADMIN.email, ADMIN.password)
  return admin.cookie
}

async function cookieOf(person) {
  if (!person) return []
  const [name, value] = (await sessionCookie(person)).split('=')
  return [{ name, value, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Strict' }]
}

export async function openStage({ device = 'desktop', person = null, stepped = false } = {}) {
  const browser = await launch()
  const context = await browser.newContext({
    ...DEVICES[device], locale: 'tr-TR', timezoneId: 'Europe/Istanbul', serviceWorkers: 'block',
    colorScheme: 'light', reducedMotion: 'no-preference',
  })
  await context.addCookies(await cookieOf(person))
  // Kare kare çekimde tarihi Playwright'ın sahte saati verir (Timeline.install); keşif görüntülerinde bu fark.
  const stage = { offsetMs: stepped ? 0 : offsetSeconds() * 1000, pointer: device === 'phone' ? 'touch' : 'mouse' }
  await context.addInitScript(`window.__STAGE__ = ${JSON.stringify(stage)};`)
  await context.addInitScript({ path: STAGE_SCRIPT })
  const page = await context.newPage()
  page.on('pageerror', (error) => console.error('  sayfa hatası:', error.message))
  return { browser, context, page }
}

export const demoNow = () => new Date(Date.now() + offsetSeconds() * 1000)

const busy = () => !!document.querySelector('.el-skeleton, .van-skeleton, .el-loading-mask, .van-loading')

/**
 * Sayfa tamamen hazır: ağ sustu, fontlar yüklendi, iskelet (yükleniyor) görünmüyor. Kare kare çekimde zaman
 * durduğu için sayfanın zamanı tl.idle ile kayıt dışında ilerletilir; değilse gerçek zamanda beklenir.
 */
export async function settle(page, { quiet = 400, tl = null } = {}) {
  const pass = (ms) => (tl ? tl.idle(ms) : page.waitForTimeout(ms))
  for (let i = 0; i < 60; i++) {
    await page.waitForLoadState('networkidle').catch(() => {})
    await pass(150)
    if (!(await page.evaluate(busy).catch(() => true))) break
  }
  await page.evaluate(() => document.fonts.ready)
  await pass(quiet)
}
