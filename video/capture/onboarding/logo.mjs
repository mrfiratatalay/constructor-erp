// Kurgusal "Atalay Yapı" logosu: kurulumda patron bunu yükler, firma çalışma alanında görünür.
// İskele ERP'nin renklerinden bilerek farklı (müşterinin kendi kimliği): koyu turkuaz, beyaz bina silüeti.
import { join } from 'node:path'
import { CACHE } from '../lib/stack.mjs'

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0e5e6f"/>
  <g fill="#ffffff">
    <rect x="132" y="236" width="64" height="150" rx="10"/>
    <rect x="224" y="168" width="64" height="218" rx="10"/>
    <rect x="316" y="112" width="64" height="274" rx="10"/>
  </g>
  <rect x="108" y="392" width="296" height="18" rx="9" fill="#f59e0b"/>
</svg>`

export const makeLogo = async (browser) => {
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } })
  await page.setContent(`<body style="margin:0;background:transparent">${SVG}</body>`)
  const file = join(CACHE, 'atalay-logo.png')
  await page.locator('svg').screenshot({ path: file, omitBackground: true })
  await page.close()
  return file
}
