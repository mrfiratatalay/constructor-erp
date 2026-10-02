// Sahanın küçük nesneleri: demir yüklü tır, demir demetleri, çimento torbaları, şantiye çiti, işçi siluetleri.
import * as THREE from 'three'
import { box, rod } from './parts.js'

/** Demir demeti: altıgen dizilmiş çubuklar, uçları kademeli, üç yerden tel bağlı. */
export function rebarBundle(m, { x, z, length = 12, bars = 37, y = 0.12, angle = 0 }) {
  const group = new THREE.Group()
  const step = 0.034
  let placed = 0
  for (let ring = 0; placed < bars; ring++) {
    const count = ring === 0 ? 1 : ring * 6
    for (let k = 0; k < count && placed < bars; k++, placed++) {
      const a = (k / count) * Math.PI * 2
      const by = y + 0.11 + Math.sin(a) * ring * step
      const bz = Math.cos(a) * ring * step
      const shift = ((placed * 37) % 11) * 0.03
      group.add(rod(m.rebar, [-length / 2 + shift, by, bz], [length / 2 - shift * 0.6, by, bz], 0.011))
    }
  }
  for (const tie of [-0.38, 0, 0.38]) {
    const wire = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.01, 6, 18), m.steel)
    wire.position.set(tie * length, y + 0.11, 0)
    wire.rotation.y = Math.PI / 2
    group.add(wire)
  }
  group.position.set(x, 0, z)
  group.rotation.y = angle
  return group
}

function wheel(m, x, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 18), m.tyre)
  mesh.rotation.x = Math.PI / 2
  mesh.position.set(x, 0.5, z)
  mesh.castShadow = true
  return mesh
}

/** Kamyon kabini: gövde, eğik ön cam, yan camlar, ızgara, farlar, tampon ve ayna (logosuz). */
function cab(m) {
  const group = new THREE.Group()
  group.add(box(m.truckWhite, [2.1, 1.5, 2.45], [0, 1.55, 0]))
  const upper = box(m.truckWhite, [1.7, 1.0, 2.45], [-0.2, 2.75, 0])
  group.add(upper, box(m.truckBlue, [2.12, 0.28, 2.47], [0, 1.0, 0]))
  const windshield = box(m.glass, [0.06, 1.0, 2.15], [0.72, 2.72, 0])
  windshield.rotation.z = 0.18
  group.add(windshield)
  for (const side of [-1, 1]) {
    group.add(box(m.glass, [1.0, 0.75, 0.04], [0.05, 2.75, side * 1.235]))
    group.add(box(m.steel, [0.12, 0.45, 0.06], [1.0, 2.6, side * 1.4]))
    group.add(box(m.glass, [0.05, 0.18, 0.4], [1.06, 1.25, side * 0.85]))
  }
  group.add(box(m.tyre, [0.05, 0.6, 1.4], [1.06, 1.6, 0]), box(m.steel, [0.25, 0.3, 2.5], [1.1, 0.75, 0]))
  return group
}

/** Kasası demir yüklü kamyon: öndeki kabin, kasa dikmeleri, ön ve arka dingil. */
export function truck(m, { x, z, angle = 0, loaded = true }) {
  const group = new THREE.Group()
  const front = cab(m)
  front.position.x = 4.1
  group.add(front, box(m.steel, [9.2, 0.32, 1.1], [0.2, 0.9, 0]))
  group.add(box(m.timber, [7.2, 0.12, 2.45], [-0.9, 1.15, 0]))
  for (let post = -4.3; post <= 2.5; post += 1.7) for (const side of [-1, 1]) {
    group.add(box(m.steel, [0.08, 0.9, 0.08], [post, 1.65, side * 1.18]))
  }
  for (const [wx, wz] of [[4.3, -1.05], [4.3, 1.05], [-2.3, -1.05], [-2.3, 1.05], [-3.5, -1.05], [-3.5, 1.05]]) group.add(wheel(m, wx, wz))
  if (loaded) {
    for (const offset of [-0.55, 0.55]) group.add(rebarBundle(m, { x: -0.9, z: offset, length: 7.6, bars: 30, y: 1.27 }))
  }
  group.position.set(x, 0, z)
  group.rotation.y = angle
  return group
}

export function cementBags(m, { x, z, rows = 3, cols = 4, layers = 4 }) {
  const group = new THREE.Group()
  for (let l = 0; l < layers; l++) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const bag = box(m.bagPaper, [0.48, 0.13, 0.7], [x + c * 0.5 + (l % 2) * 0.05, 0.16 + l * 0.14, z + r * 0.72])
    bag.rotation.y = (l % 2 ? 0.02 : -0.02)
    group.add(bag)
  }
  group.add(box(m.timber, [cols * 0.5 + 0.1, 0.14, rows * 0.72 + 0.1], [x + (cols - 1) * 0.25, 0.07, z + (rows - 1) * 0.36]))
  return group
}

export function fence(m, { from, to, height = 2.2 }) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const length = a.distanceTo(b)
  const panel = box(m.fence, [length, height, 0.05], [0, height / 2, 0])
  const group = new THREE.Group().add(panel)
  group.position.copy(a).add(b).multiplyScalar(0.5)
  group.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x)
  return group
}

function capsule(material, radius, length, [x, y, z], tilt = 0) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 12), material)
  mesh.position.set(x, y, z)
  mesh.rotation.x = tilt
  mesh.castShadow = true
  return mesh
}

/** İşçi: yüzü olmayan, uzakta okunacak kadar sade bir figür (iş kıyafeti, turuncu yelek, baret). */
export function worker(m, { x, z, angle = 0, helmet = 'helmetWhite', bend = 0 }) {
  const group = new THREE.Group()
  group.add(capsule(m.cloth, 0.075, 0.7, [0.1, 0.45, 0]), capsule(m.cloth, 0.075, 0.7, [-0.1, 0.45, 0]))
  const torso = capsule(m.vest, 0.17, 0.36, [0, 1.12, bend * 0.18], bend)
  const arms = [capsule(m.cloth, 0.055, 0.5, [0.24, 1.08, bend * 0.25], bend * 1.4), capsule(m.cloth, 0.055, 0.5, [-0.24, 1.08, bend * 0.25], bend * 1.4)]
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), m.skin)
  head.position.set(0, 1.55 - bend * 0.12, bend * 0.36)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), m[helmet])
  cap.position.copy(head.position).add(new THREE.Vector3(0, 0.025, 0))
  for (const mesh of [head, cap]) mesh.castShadow = true
  group.add(torso, ...arms, head, cap)
  group.position.set(x, 0, z)
  group.rotation.y = angle
  return group
}

export function formPanelStack(m, { x, z, count = 12, angle = 0 }) {
  const group = new THREE.Group()
  for (let i = 0; i < count; i++) group.add(box(m.plywood([1, 2]), [1.2, 0.04, 2.5], [0, 0.1 + i * 0.045, 0]))
  group.add(box(m.timber, [1.3, 0.08, 0.1], [0, 0.04, -1]), box(m.timber, [1.3, 0.08, 0.1], [0, 0.04, 1]))
  group.position.set(x, 0, z)
  group.rotation.y = angle
  return group
}
