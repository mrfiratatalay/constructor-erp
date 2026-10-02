// Büyük yapılar: kaba inşaatı süren bina iskeleti, cephe iskelesi, kule vinci.
import * as THREE from 'three'
import { box, rod } from './parts.js'

/** Bina iskeleti: kolonlar ve döşemeler; alt katlarda tuğla duvar, üstte açık kat. */
export function buildingFrame(m, { floors = 5, baysX = 5, baysZ = 3, bay = 4.2, storey = 3, brickFloors = 2 }) {
  const group = new THREE.Group()
  const w = baysX * bay
  const d = baysZ * bay
  for (let f = 0; f < floors; f++) {
    const y = f * storey
    group.add(box(m.concrete([w / 4, d / 4]), [w + 0.4, 0.25, d + 0.4], [0, y + storey - 0.12, 0]))
    for (let i = 0; i <= baysX; i++) for (let j = 0; j <= baysZ; j++) {
      group.add(box(m.oldConcrete([0.2, 1]), [0.45, storey, 0.45], [i * bay - w / 2, y + storey / 2, j * bay - d / 2]))
    }
    if (f < brickFloors) {
      group.add(box(m.brick([w / 3, storey / 2]), [w, storey - 0.3, 0.2], [0, y + storey / 2, d / 2]))
      group.add(box(m.brick([d / 3, storey / 2]), [0.2, storey - 0.3, d], [-w / 2, y + storey / 2, 0]))
    }
  }
  return group
}

/** Cephe iskelesi: düşey borular, yatay bağlar, çapraz ve tahta platformlar (İskele ERP'nin adını aldığı şey). */
export function scaffold(m, { width, height, z, x = 0, bay = 2.4, lift = 2, depth = 1 }) {
  const group = new THREE.Group()
  for (let i = 0; i <= Math.round(width / bay); i++) {
    const px = x - width / 2 + i * bay
    for (const pz of [z, z + depth]) group.add(rod(m.galvanized, [px, 0, pz], [px, height, pz], 0.024))
  }
  for (let y = lift; y <= height; y += lift) {
    for (const pz of [z, z + depth]) group.add(rod(m.galvanized, [x - width / 2, y, pz], [x + width / 2, y, pz], 0.02))
    group.add(box(m.timber, [width, 0.04, depth - 0.1], [x, y - 0.04, z + depth / 2]))
    group.add(rod(m.galvanized, [x - width / 2, y + 1, z + depth], [x + width / 2, y + 1, z + depth], 0.016))
  }
  for (let i = 0; i < Math.round(width / bay); i += 2) {
    const px = x - width / 2 + i * bay
    group.add(rod(m.galvanized, [px, 0, z + depth], [px + bay, Math.min(height, lift * 2), z + depth], 0.016))
  }
  return group
}

function lattice(m, { from, length, size, axis }) {
  const group = new THREE.Group()
  const step = size
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [a * size / 2, b * size / 2])
  const along = (t, [a, b]) => (axis === 'y' ? [from[0] + a, from[1] + t, from[2] + b] : [from[0] + t, from[1] + a, from[2] + b])
  for (const corner of corners) group.add(rod(m.craneYellow, along(0, corner), along(length, corner), 0.05))
  for (let t = 0; t < length; t += step) {
    for (let c = 0; c < 4; c++) {
      group.add(rod(m.craneYellow, along(t, corners[c]), along(t + step, corners[(c + 1) % 4]), 0.025))
    }
  }
  return group
}

/** Kule vinci: kafes kule, bom, karşı bom, karşı ağırlık, kabin ve kanca halatı. */
export function towerCrane(m, { x, z, height = 38, jib = 34, rotation = 0 }) {
  const group = new THREE.Group()
  group.add(box(m.concrete([1, 1]), [5, 1, 5], [0, 0.5, 0]))
  group.add(lattice(m, { from: [0, 0, 0], length: height, size: 1.8, axis: 'y' }))
  const head = new THREE.Group()
  head.position.y = height
  head.add(lattice(m, { from: [-0.4, 0, 0], length: jib, size: 1.2, axis: 'x' }))
  head.add(lattice(m, { from: [-11, 0, 0], length: 10.6, size: 1.2, axis: 'x' }))
  head.add(box(m.oldConcrete([1, 1]), [3.2, 2.4, 2], [-9.5, -1.4, 0]))
  head.add(box(m.craneYellow, [2.2, 2, 2], [1, -1.6, 1.4]))
  head.add(box(m.glass, [0.05, 1.2, 1.6], [2.12, -1.4, 1.4]))
  head.add(rod(m.craneYellow, [0, 0.6, 0], [0, 7, 0], 0.08))
  head.add(rod(m.steel, [0, 7, 0], [jib * 0.98, 0.6, 0], 0.02))
  head.add(rod(m.steel, [0, 7, 0], [-10.5, 0.6, 0], 0.02))
  const trolley = jib * 0.62
  head.add(rod(m.steel, [trolley, -0.6, 0], [trolley, -height * 0.55, 0], 0.012))
  head.add(box(m.craneYellow, [0.6, 0.8, 0.4], [trolley, -height * 0.55 - 0.4, 0]))
  head.rotation.y = rotation
  group.add(head)
  group.position.set(x, 0, z)
  return group
}

function seeded(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) / 2147483647)
}

/** Arka plandaki tepeler (Karadeniz): yuvarlak sırtlar, sisin içinde kaybolan iki sıra. */
export function hills(m, { radius = 420, rows = 2, seed = 1 }) {
  const group = new THREE.Group()
  const random = seeded(seed)
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + random() * 0.15
      const r = radius + row * 260
      const size = 110 + random() * 120 + row * 60
      const hill = new THREE.Mesh(new THREE.SphereGeometry(size, 28, 14), row ? m.hillFar : m.hill)
      hill.position.set(Math.cos(angle) * r, -size * 0.62, Math.sin(angle) * r)
      hill.scale.set(1.5, 0.75 + random() * 0.35, 1)
      hill.rotation.y = -angle
      group.add(hill)
    }
  }
  return group
}

/** Uzak şehir dokusu: tepelerin önünde dağınık, açık renkli apartmanlar ve kiremit çatılı evler. */
export function cityscape(m, { radius = 330, count = 160, seed = 2, skip = null }) {
  const group = new THREE.Group()
  const random = seeded(seed)
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    if (skip && angle > skip[0] && angle < skip[1]) continue
    const r = radius + random() * 160
    const floors = 2 + Math.floor(random() * 7)
    const w = 8 + random() * 10
    const house = box(random() > 0.3 ? m.plaster : m.oldConcrete([1, 1]), [w, floors * 3, 8 + random() * 6], [Math.cos(angle) * r, floors * 1.5, Math.sin(angle) * r])
    house.rotation.y = random() * Math.PI
    group.add(house)
  }
  return group
}
