// İnsan gibi kullanım: imleç ışınlanmaz, hafif kavisle hızlanıp yavaşlayarak gider; tıklamadan önce kısa bir an
// bekler; yazı harf harf, doğal aralıklarla yazılır; kaydırma yavaş başlar, yavaş biter.
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const pause = (page, ms) => page.waitForTimeout(ms)

export class Hand {
  constructor(page, { x = 900, y = 560 } = {}) {
    this.page = page
    this.x = x
    this.y = y
    this.seed = 7
  }

  random() {
    this.seed = (this.seed * 16807) % 2147483647
    return this.seed / 2147483647
  }

  async pointOf(target, { dx = 0.5, dy = 0.5 } = {}) {
    if (Array.isArray(target)) return { x: target[0], y: target[1] }
    await target.scrollIntoViewIfNeeded()
    const box = await target.boundingBox()
    if (!box) throw new Error(`görünmeyen hedef: ${target}`)
    return { x: box.x + box.width * dx, y: box.y + box.height * dy }
  }

  /** Hedefe kavisli, yumuşak bir yol; süre mesafeyle büyür (Fitts). */
  async move(target, options = {}) {
    const to = await this.pointOf(target, options)
    const distance = Math.hypot(to.x - this.x, to.y - this.y)
    const duration = options.duration ?? Math.min(950, 260 + distance * 0.75)
    const steps = Math.max(8, Math.round(duration / 16))
    const bend = (this.random() - 0.5) * Math.min(120, distance * 0.25)
    const from = { x: this.x, y: this.y }
    const normal = { x: -(to.y - from.y) / (distance || 1), y: (to.x - from.x) / (distance || 1) }
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps)
      const arc = Math.sin(Math.PI * t) * bend
      await this.page.mouse.move(from.x + (to.x - from.x) * t + normal.x * arc, from.y + (to.y - from.y) * t + normal.y * arc)
      await pause(this.page, duration / steps)
    }
    Object.assign(this, to)
  }

  async click(target, options = {}) {
    await this.move(target, options)
    await pause(this.page, options.hover ?? 140 + this.random() * 110)
    await this.page.mouse.down()
    await pause(this.page, 70)
    await this.page.mouse.up()
    await pause(this.page, options.after ?? 200)
  }

  /** Harf harf yazar: harf arası 45–110 ms, boşluktan sonra biraz daha uzun. */
  async type(text, { speed = 1 } = {}) {
    for (const char of text) {
      await this.page.keyboard.type(char)
      const base = char === ' ' ? 120 : 45 + this.random() * 65
      await pause(this.page, base / speed)
    }
  }

  async fill(target, text, options = {}) {
    await this.click(target, options)
    await this.type(text, options)
  }

  /** Tekerlekle yumuşak kaydırma: toplam dy pikseli, süre boyunca hızlanıp yavaşlayarak. */
  async scroll(dy, { duration = 900, at = null } = {}) {
    if (at) await this.move(at)
    const steps = Math.round(duration / 16)
    let done = 0
    for (let i = 1; i <= steps; i++) {
      const next = Math.round(dy * ease(i / steps))
      await this.page.mouse.wheel(0, next - done)
      done = next
      await pause(this.page, 16)
    }
  }

  wait(ms) {
    return pause(this.page, ms)
  }
}
