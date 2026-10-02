// Betonarmenin parçaları: döşeme, kalıplanmış kolon, filiz demirleri, dikmeler. Ölçüler metre cinsinden.
import * as THREE from 'three'

export function box(material, [w, h, d], [x, y, z] = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

export function rod(material, from, to, radius = 0.008) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 6), material)
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  mesh.castShadow = true
  return mesh
}

export function slab(m, { w, d, t = 0.22, y = 0 }) {
  return box(m.concrete([w / 4, d / 4]), [w, t, d], [0, y - t / 2, 0])
}

/** Filiz demirleri: kolonun kalıbından yukarı taşan düşey demirler ve etriye. */
function starterBars(m, { w, d, top }) {
  const group = new THREE.Group()
  const inset = 0.05
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]]
  for (const [cx, cz] of corners) {
    const x = cx * (w / 2 - inset)
    const z = cz * (d / 2 - inset)
    const lean = (Math.abs(cx) + Math.abs(cz)) * 0.01
    group.add(rod(m.rebar, [x, top - 0.1, z], [x * (1 + lean), top + 0.85, z * (1 + lean)], 0.009))
  }
  for (let level = 0; level < 3; level++) {
    const y = top + 0.12 + level * 0.18
    const hw = w / 2 - inset
    const hd = d / 2 - inset
    const ring = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd], [-hw, -hd]]
    for (let i = 0; i < 4; i++) group.add(rod(m.rebar, [ring[i][0], y, ring[i][1]], [ring[i + 1][0], y, ring[i + 1][1]], 0.005))
  }
  return group
}

/** Kolon kalıbı: dört yüzde kalıp levhası, dikey kirişler (H20) ve çelik kelepçeler; üstten filizler çıkar. */
export function formworkColumn(m, { x, z, w = 0.5, d = 0.5, h = 3, ply = 'plywood' }) {
  const group = new THREE.Group()
  const t = 0.03
  const sides = [
    [[w + 2 * t, h, t], [0, h / 2, d / 2 + t / 2]],
    [[w + 2 * t, h, t], [0, h / 2, -d / 2 - t / 2]],
    [[t, h, d], [w / 2 + t / 2, h / 2, 0]],
    [[t, h, d], [-w / 2 - t / 2, h / 2, 0]],
  ]
  for (const [size, position] of sides) group.add(box(m[ply]([0.6, h / 2]), size, position))
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    group.add(box(m.beamYellow, [0.08, h - 0.1, 0.08], [sx * (w / 2 + 0.07), h / 2, sz * (d / 2 + 0.07)]))
  }
  for (let level = 0.4; level < h; level += 0.75) {
    group.add(box(m.steel, [w + 0.3, 0.06, 0.05], [0, level, d / 2 + 0.13]))
    group.add(box(m.steel, [w + 0.3, 0.06, 0.05], [0, level, -d / 2 - 0.13]))
    group.add(box(m.steel, [0.05, 0.06, d + 0.3], [w / 2 + 0.13, level, 0]))
    group.add(box(m.steel, [0.05, 0.06, d + 0.3], [-w / 2 - 0.13, level, 0]))
  }
  group.add(starterBars(m, { w, d, top: h }))
  group.position.set(x, 0, z)
  return group
}

/** Payandalı (eğik destek) kolon: kalıbı iki yönden tutan teleskopik dikmeler. */
export function braces(m, { x, z, h = 3 }) {
  const group = new THREE.Group()
  group.add(rod(m.propRed, [x + 1.5, 0.02, z + 0.3], [x + 0.35, h * 0.68, z + 0.1], 0.03))
  group.add(rod(m.propRed, [x - 0.3, 0.02, z + 1.5], [x - 0.1, h * 0.68, z + 0.35], 0.03))
  return group
}

export function rebarMat(m, { x, z, w, d, spacing = 0.2, y = 0.06 }) {
  const group = new THREE.Group()
  for (let i = -w / 2; i <= w / 2; i += spacing) group.add(rod(m.rebar, [x + i, y, z - d / 2], [x + i, y, z + d / 2], 0.007))
  for (let j = -d / 2; j <= d / 2; j += spacing) group.add(rod(m.rebar, [x - w / 2, y + 0.016, z + j], [x + w / 2, y + 0.016, z + j], 0.007))
  return group
}

/** Teleskopik dikme: altlık, iki boru, üst tabla. */
export function shore(m, { x, z, h }) {
  const group = new THREE.Group()
  group.add(box(m.steel, [0.18, 0.01, 0.18], [x, 0.005, z]))
  group.add(rod(m.propRed, [x, 0, z], [x, h * 0.55, z], 0.026))
  group.add(rod(m.galvanized, [x, h * 0.5, z], [x, h, z], 0.02))
  group.add(box(m.steel, [0.16, 0.02, 0.16], [x, h, z]))
  return group
}
