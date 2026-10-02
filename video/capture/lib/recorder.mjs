// Sayfayı kare kare kaydeder (CDP screencast): her kare zaman damgasıyla diske yazılır, sonra ffmpeg sabit 60 kare/sn
// videoya çevirir. Sayfa değişmediğinde kare gelmez; o süre önceki karenin süresine eklenir. mark(): kurgu için ad
// verilmiş anlar (ör. "yazmaya başladı"), videonun başından saniye olarak <ad>.json'a yazılır.
import { execFileSync } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'

export class Recorder {
  constructor(page, { name, outDir, quality = 90 }) {
    this.page = page
    this.name = name
    this.outDir = outDir
    this.quality = quality
    this.frames = []
    this.marks = []
    this.pending = []
  }

  async start() {
    this.frameDir = `${this.outDir}/${this.name}.frames`
    await rm(this.frameDir, { recursive: true, force: true })
    await mkdir(this.frameDir, { recursive: true })
    this.cdp = await this.page.context().newCDPSession(this.page)
    this.cdp.on('Page.screencastFrame', (frame) => this.onFrame(frame))
    await this.cdp.send('Page.startScreencast', { format: 'jpeg', quality: this.quality, everyNthFrame: 1 })
    await this.page.waitForTimeout(300)
    this.startedAt = this.frames[0]?.time ?? Date.now() / 1000
  }

  onFrame({ data, metadata, sessionId }) {
    const index = this.frames.length
    const file = `${this.frameDir}/${String(index).padStart(6, '0')}.jpg`
    this.frames.push({ file, time: metadata.timestamp })
    this.pending.push(writeFile(file, Buffer.from(data, 'base64')))
    this.cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  }

  mark(label) {
    this.marks.push({ label, at: Date.now() / 1000 - this.startedAt })
  }

  /** Sayfa hiç değişmese de en az bir kare daha gelsin: son durum videoda kalır. */
  async hold(ms) {
    await this.page.waitForTimeout(ms)
  }

  async stop() {
    const endedAt = Date.now() / 1000
    await this.cdp.send('Page.stopScreencast')
    await Promise.all(this.pending)
    const list = this.frames.map((frame, i) => {
      const next = this.frames[i + 1]?.time ?? endedAt
      return `file '${frame.file}'\nduration ${Math.max(0.001, next - frame.time).toFixed(4)}`
    })
    list.push(`file '${this.frames.at(-1).file}'`)
    const listFile = `${this.frameDir}/list.txt`
    await writeFile(listFile, `ffconcat version 1.0\n${list.join('\n')}\n`)
    const video = `${this.outDir}/${this.name}.mp4`
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listFile,
      '-vf', 'fps=60,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-movflags', '+faststart', video])
    const offset = this.frames[0].time - this.startedAt
    const meta = { name: this.name, duration: endedAt - this.frames[0].time, frames: this.frames.length,
      marks: this.marks.map((m) => ({ ...m, at: +(m.at - offset).toFixed(3) })) }
    await writeFile(`${this.outDir}/${this.name}.json`, JSON.stringify(meta, null, 2))
    await rm(this.frameDir, { recursive: true, force: true })
    return meta
  }
}
