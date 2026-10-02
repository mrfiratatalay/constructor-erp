// Kare kare çekim: sayfanın zamanı durur, her karede tam 1/30 sn ilerler. JS saati (Date, zamanlayıcılar, rAF)
// Playwright'ın sahte saatiyle; CSS geçişleri ve animasyonları belge zaman çizelgesi durdurulup elle ilerletilerek.
// Görüntü her karede alınır: makine ne kadar yavaş olursa olsun video akıcı ve tam çözünürlüklü çıkar.
import { execFileSync } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'

export const FPS = 30
const STEP = 1000 / FPS

/** Sayfa içinde: duran zaman çizelgesindeki bütün animasyonları dt kadar ileri sarar. */
const ADVANCE = (dt) => {
  window.__stageMask?.()
  for (const animation of document.getAnimations()) {
    if (animation.__stage === undefined) {
      animation.pause()
      animation.__stage = animation.currentTime ?? 0
    }
    animation.__stage += dt
    animation.currentTime = animation.__stage
  }
}

export class Timeline {
  constructor(page, { name, outDir, quality = 92, scale = 2 }) {
    Object.assign(this, { page, name, outDir, quality, scale })
    this.count = 0
    this.marks = []
    this.writes = []
  }

  /** Sayfa açılmadan önce: sahte saat kurulur ve demo anında durdurulur. */
  async install(time) {
    await this.page.clock.install({ time })
    await this.page.clock.pauseAt(time)
  }

  /** Her yeni belgede animasyon zaman çizelgesi durdurulur (gezinmeden sonra da). */
  async freezeAnimations() {
    this.cdp ??= await this.page.context().newCDPSession(this.page)
    await this.cdp.send('Animation.enable')
    await this.cdp.send('Animation.setPlaybackRate', { playbackRate: 0 })
  }

  async start() {
    this.frameDir = `${this.outDir}/${this.name}.frames`
    await rm(this.frameDir, { recursive: true, force: true })
    await mkdir(this.frameDir, { recursive: true })
    await this.freezeAnimations()
    this.page.on('framenavigated', (frame) => frame === this.page.mainFrame() && this.freezeAnimations().catch(() => {}))
  }

  async capture() {
    const { width, height } = this.page.viewportSize()
    const clip = { x: 0, y: 0, width, height, scale: this.scale }
    const { data } = await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: this.quality, optimizeForSpeed: true, clip })
    const file = `${this.frameDir}/${String(this.count++).padStart(6, '0')}.jpg`
    this.writes.push(writeFile(file, Buffer.from(data, 'base64')))
  }

  /** n kare: her biri 1/30 sn ileri, sonra görüntü. */
  async frames(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.clock.runFor(STEP)
      await this.page.evaluate(ADVANCE, STEP).catch(() => {})
      await this.capture()
    }
  }

  wait(ms) {
    return this.frames(Math.max(1, Math.round(ms / STEP)))
  }

  /** Kayıt dışı ilerleme (hazırlık): zaman akar, görüntü alınmaz. */
  async idle(ms) {
    for (let t = 0; t < ms; t += 50) {
      await this.page.clock.runFor(50)
      await this.page.evaluate(ADVANCE, 50).catch(() => {})
    }
  }

  mark(label) {
    this.marks.push({ label, at: +(this.count / FPS).toFixed(3) })
  }

  async stop() {
    await Promise.all(this.writes)
    const video = `${this.outDir}/${this.name}.mp4`
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', `${this.frameDir}/%06d.jpg`,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', video])
    const meta = { name: this.name, fps: FPS, duration: this.count / FPS, frames: this.count, marks: this.marks }
    await writeFile(`${this.outDir}/${this.name}.json`, JSON.stringify(meta, null, 2))
    await rm(this.frameDir, { recursive: true, force: true })
    return meta
  }
}
