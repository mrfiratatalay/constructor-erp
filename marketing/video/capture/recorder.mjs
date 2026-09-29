import { mkdirSync, writeFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)

/**
 * Bir çekimin defteri: her adımın ekran görüntüsü public/captures/<ad>/ altına, adımların listesi (hangi resim,
 * nereye dokunuldu, hangi katman nerede) src/captures/<ad>.json'a yazılır. Video bu listeyi okur; uygulama değişip
 * çekim yenilenince parmak ve imleç kendiliğinden doğru yere gider.
 */
export class Recorder {
  constructor(name) {
    this.name = name
    this.dir = new URL(`public/captures/${name}/`, root)
    this.screens = {}
    mkdirSync(this.dir, { recursive: true })
  }

  /**
   * Ekranın tamamı. Animasyonların oturması beklenir: halka dolar, pencere açılır. Kaydırma konumu da yazılır:
   * video iki ekran arasındaki kaydırmayı bu farkla canlandırır.
   */
  async shot(page, name, settle = 700) {
    await page.waitForTimeout(settle)
    await page.screenshot({ path: this.file(name), animations: 'disabled' })
    const scrollY = await page.evaluate(() => Math.round(window.scrollY))
    this.screens[name] = { src: `captures/${this.name}/${name}.png`, ...page.viewportSize(), scrollY }
  }

  /**
   * Sayfanın tamamı tek uzun şerit, sabit parçalar (başlık, alt çubuklar) gizli. İki ekran görüntüsü arasındaki
   * kaydırma uzunsa ikisinin de görmediği satırlar kalır; video kaydırmayı bu şeritten oynatır. hidden: gizlenecek
   * sabit parçaların seçicileri. Gizleme yer kaplamaya devam eder: şeritteki y, sayfadaki y'nin aynısıdır.
   */
  async strip(page, name, hidden) {
    const style = await page.addStyleTag({ content: `${hidden.join(', ')} { visibility: hidden !important; }` })
    await page.screenshot({ path: this.file(name), fullPage: true, animations: 'disabled' })
    await style.evaluate((element) => element.remove())
    const size = await page.evaluate(() => ({ width: innerWidth, height: document.documentElement.scrollHeight }))
    this.screens[name] = { src: `captures/${this.name}/${name}.png`, ...size }
  }

  /** Yalnızca bir öğenin yeri (resim yok): kaydırmada sabit kalan başlık, cetvelin dolacak alanı. */
  async mark(locator, name) {
    this.screens[name] = { box: await boxOf(locator) }
  }

  /** Ayrı katman: alttan açılan pencere, sağdan gelen panel. Video onu kendi hareketiyle getirir. */
  async layer(page, locator, name, settle = 700) {
    await page.waitForTimeout(settle)
    await locator.screenshot({ path: this.file(name), animations: 'disabled' })
    this.screens[name] = { src: `captures/${this.name}/${name}.png`, box: await boxOf(locator) }
  }

  /**
   * Dokunulacak yeri kaydeder, sonra dokunur. Fare köşeye çekilir: tıklanan yerde kalırsa yeni açılan ekranda
   * altındaki şeyi (ör. takvimde bir günü) üzerine gelinmiş gibi boyar.
   */
  async tap(locator, name) {
    await locator.scrollIntoViewIfNeeded()
    this.screens[name] = { box: await boxOf(locator) }
    await locator.click()
    await locator.page().mouse.move(1, 1)
  }

  /** Hesaplanmış bir alan (ör. cetvelin gün hücreleri): tek bir öğe değil, birkaçının birleşimi. */
  region(name, box) {
    this.screens[name] = { box }
  }

  save() {
    const manifest = new URL(`src/captures/${this.name}.json`, root)
    mkdirSync(new URL('.', manifest), { recursive: true })
    writeFileSync(manifest, `${JSON.stringify(this.screens, null, 2)}\n`)
  }

  file(name) {
    return new URL(`${name}.png`, this.dir).pathname
  }
}

async function boxOf(locator) {
  const box = await locator.boundingBox()
  if (!box) throw new Error(`Görünmeyen öğe: ${locator}`)
  const round = (value) => Math.round(value * 10) / 10
  return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height) }
}
