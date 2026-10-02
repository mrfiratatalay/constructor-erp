// Prosedürel dokular: tuval üzerinde gürültü ve çizgilerle beton, kontrplak kalıp, toprak, tuğla. Tohumlu rastgele:
// her çalıştırmada aynı fotoğraf çıkar.
import * as THREE from 'three'

export function rng(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canvasOf(size, paint) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  paint(canvas.getContext('2d'), size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function speckle(ctx, size, random, { count, alpha, light, dark, radius }) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = random() > 0.5 ? `rgba(${light},${alpha * random()})` : `rgba(${dark},${alpha * random()})`
    const r = radius * (0.3 + random())
    ctx.beginPath()
    ctx.arc(random() * size, random() * size, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function concrete(seed = 1, base = '#a9a8a2') {
  const random = rng(seed)
  return canvasOf(512, (ctx, size) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    speckle(ctx, size, random, { count: 900, alpha: 0.08, light: '255,255,250', dark: '40,40,40', radius: 26 })
    speckle(ctx, size, random, { count: 9000, alpha: 0.18, light: '240,240,235', dark: '60,60,58', radius: 1.4 })
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = `rgba(70,62,50,${0.05 + random() * 0.05})`
      ctx.fillRect(random() * size, random() * size, 40 + random() * 160, 6 + random() * 50)
    }
  })
}

export function plywood(seed = 2, base = '#d6a23e') {
  const random = rng(seed)
  return canvasOf(512, (ctx, size) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    for (let y = 0; y < size; y += 2) {
      const wave = Math.sin(y * 0.05 + random() * 0.4) * 6
      ctx.strokeStyle = `rgba(120,70,20,${0.05 + random() * 0.08})`
      ctx.beginPath()
      ctx.moveTo(0, y + wave)
      ctx.bezierCurveTo(size / 3, y - wave, (2 * size) / 3, y + wave, size, y - wave)
      ctx.stroke()
    }
    speckle(ctx, size, random, { count: 2400, alpha: 0.12, light: '255,230,170', dark: '90,50,10', radius: 1.6 })
    ctx.fillStyle = 'rgba(80,80,80,0.18)'
    for (let i = 0; i < 5; i++) ctx.fillRect(0, random() * size, size, 3)
  })
}

export function soil(seed = 3) {
  const random = rng(seed)
  return canvasOf(512, (ctx, size) => {
    ctx.fillStyle = '#8b7357'
    ctx.fillRect(0, 0, size, size)
    speckle(ctx, size, random, { count: 700, alpha: 0.18, light: '190,170,140', dark: '60,45,30', radius: 30 })
    speckle(ctx, size, random, { count: 14000, alpha: 0.35, light: '210,200,185', dark: '50,40,30', radius: 1.5 })
  })
}

export function brick(seed = 4) {
  const random = rng(seed)
  return canvasOf(512, (ctx, size) => {
    ctx.fillStyle = '#c9c4b8'
    ctx.fillRect(0, 0, size, size)
    const rows = 16
    const h = size / rows
    for (let row = 0; row < rows; row++) {
      const offset = row % 2 ? 32 : 0
      for (let x = -64 + offset; x < size; x += 64) {
        const tone = 165 + Math.floor(random() * 40)
        ctx.fillStyle = `rgb(${tone + 30},${tone - 25},${tone - 55})`
        ctx.fillRect(x + 2, row * h + 2, 60, h - 4)
      }
    }
    speckle(ctx, size, random, { count: 5000, alpha: 0.2, light: '255,230,210', dark: '60,30,20', radius: 1.2 })
  })
}

/** Gökyüzü: üstte derin mavi, ufukta sıcak beyaz; yumuşak bulut bantları. */
export function sky(seed = 5) {
  const random = rng(seed)
  const texture = canvasOf(1024, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, size)
    gradient.addColorStop(0, '#5f8fc4')
    gradient.addColorStop(0.42, '#a9c6e2')
    gradient.addColorStop(0.5, '#e9ece6')
    gradient.addColorStop(1, '#d9dcd6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 70; i++) {
      const y = size * (0.16 + random() * 0.3)
      ctx.fillStyle = `rgba(255,255,255,${0.04 + random() * 0.08})`
      ctx.beginPath()
      ctx.ellipse(random() * size, y, 60 + random() * 220, 8 + random() * 26, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}
