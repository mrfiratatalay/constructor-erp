// İnsan gibi kullanım, kare zamanında: imleç ışınlanmaz, hafif kavisle hızlanıp yavaşlayarak gider (her adım bir kare);
// tıklamadan önce kısa bir an bekler; yazı harf harf, doğal aralıklarla; kaydırma yavaş başlar, yavaş biter.
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const FRAME = 1000 / 30

export class Hand {
  constructor(page, timeline, { x = 900, y = 560 } = {}) {
    Object.assign(this, { page, tl: timeline, x, y })
    this.seed = 7
  }

  random() {
    this.seed = (this.seed * 16807) % 2147483647
    return this.seed / 2147483647
  }

  wait(ms) {
    return this.tl.wait(ms)
  }

  async pointOf(target, { dx = 0.5, dy = 0.5 } = {}) {
    if (Array.isArray(target)) return { x: target[0], y: target[1] }
    let box = await target.boundingBox()
    const view = this.page.viewportSize()
    if (box && (box.y + box.height * dy < 0 || box.y + box.height * dy > view.height)) {
      await target.scrollIntoViewIfNeeded()
      box = await target.boundingBox()
    }
    if (!box) throw new Error(`görünmeyen hedef: ${target}`)
    return { x: box.x + box.width * dx, y: box.y + box.height * dy }
  }

  /** Hedefe kavisli, yumuşak bir yol; süre mesafeyle büyür (Fitts). */
  async move(target, options = {}) {
    const to = await this.pointOf(target, options)
    const distance = Math.hypot(to.x - this.x, to.y - this.y)
    const duration = options.duration ?? Math.min(900, 280 + distance * 0.7)
    const steps = Math.max(4, Math.round(duration / FRAME))
    const bend = (this.random() - 0.5) * Math.min(110, distance * 0.22)
    const from = { x: this.x, y: this.y }
    const normal = { x: -(to.y - from.y) / (distance || 1), y: (to.x - from.x) / (distance || 1) }
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps)
      const arc = Math.sin(Math.PI * t) * bend
      await this.page.mouse.move(from.x + (to.x - from.x) * t + normal.x * arc, from.y + (to.y - from.y) * t + normal.y * arc)
      await this.tl.frames(1)
    }
    Object.assign(this, to)
  }

  async click(target, options = {}) {
    await this.move(target, options)
    await this.wait(options.hover ?? 130 + this.random() * 100)
    await this.page.mouse.down()
    await this.tl.frames(2)
    await this.page.mouse.up()
    await this.wait(options.after ?? 260)
  }

  /** Harf harf yazar: harf arası ~45–110 ms, boşluktan sonra biraz daha uzun. speed > 1 hızlandırır. */
  async type(text, { speed = 1 } = {}) {
    let owed = 0
    for (const char of text) {
      await this.page.keyboard.type(char)
      owed += (char === ' ' ? 115 : 45 + this.random() * 60) / speed
      if (owed >= FRAME) {
        const frames = Math.floor(owed / FRAME)
        owed -= frames * FRAME
        await this.tl.frames(frames)
      }
    }
    await this.tl.frames(1)
  }

  /** Alana tıklar, içindekini seçip üzerine yazar (önceden dolu gelen alanlarda da doğru sonuç). */
  async fill(target, text, options = {}) {
    await this.click(target, options)
    await this.page.keyboard.press('Control+A')
    await this.type(text, options)
  }

  /** Tekerlekle yumuşak kaydırma: toplam dy piksel, süre boyunca hızlanıp yavaşlayarak; her adım bir kare. */
  async scroll(dy, { duration = 900, at = null } = {}) {
    if (at) await this.move(at)
    const steps = Math.max(4, Math.round(duration / FRAME))
    let done = 0
    for (let i = 1; i <= steps; i++) {
      const next = Math.round(dy * ease(i / steps))
      if (next !== done) await this.page.mouse.wheel(0, next - done)
      done = next
      await this.tl.frames(1)
    }
  }
}
