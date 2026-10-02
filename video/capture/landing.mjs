// Part 1 sonu: tanıtım sitesinin ilk ekranı (hero). Logo animasyonu header'daki markanın tam yerine iner.
import { WEB, openBrowser, openContext } from './lib/browser.mjs'
import { settle, shoot } from './lib/shoot.mjs'

// İskele animasyonu bu kutulara dönüşür: header, menü, başlıklar, butonlar, önizleme kartı.
const TARGETS = {
  header: 'header.marketing-top',
  brand: '.marketing-brand',
  links: '.marketing-top__links',
  eyebrow: '.hero__eyebrow',
  headline: '.hero h1',
  lead: '.hero__copy > p',
  apply: '.hero__primary',
  explore: '.hero__secondary',
  promises: '.hero__promises',
  preview: '.hero__preview',
  pricing: '.marketing-top__links a:last-child',
}

const browser = await openBrowser()
const context = await openContext(browser)
const page = await context.newPage()
await page.goto(`${WEB}/`)
await settle(page, 600)
await page.mouse.move(1500, 1000)
await shoot(page, 'landing', 'hero', TARGETS)
await browser.close()
