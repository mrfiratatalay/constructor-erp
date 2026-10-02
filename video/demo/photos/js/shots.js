// Fotoğraf çekimleri: her biri bir sahne kurar ve kamerasını verir. Ad = dosya adı (out/photos/<ad>.jpg).
import * as THREE from 'three'
import { createMaterials } from './materials.js'
import { braces, formworkColumn, rebarMat, shore, slab } from './parts.js'
import { cementBags, fence, formPanelStack, rebarBundle, truck, worker } from './props.js'
import { buildingFrame, cityscape, hills, scaffold, towerCrane } from './structures.js'
import { ground } from './world.js'

const m = createMaterials()

function landscape(scene, { seaSide = false } = {}) {
  const meadow = new THREE.Mesh(new THREE.RingGeometry(95, 3000, 64), m.grass)
  meadow.rotation.x = -Math.PI / 2
  meadow.position.y = 0.03
  meadow.receiveShadow = true
  scene.add(ground(m.soil([300, 300])), meadow, hills(m, { seed: 3 }), cityscape(m, { seed: 5, skip: seaSide ? [4.2, 5.3] : null }))
  if (seaSide) {
    const sea = ground(m.sea, 4000)
    sea.position.set(0, 0.05, -2200)
    scene.add(sea)
  }
}

/** 2. kat döşemesi: kalıbı bitmiş kolonlar, filiz demirleri; arkada vinç ve komşu blok. */
function columns(scene) {
  landscape(scene)
  const floor = new THREE.Group()
  floor.position.y = 6
  floor.add(slab(m, { w: 26, d: 18 }))
  for (const [x, z] of [[-6, -4], [0, -4], [6, -4], [-6, 2.5], [0, 2.5], [6, 2.5], [-6, 9], [0, 9]]) {
    floor.add(formworkColumn(m, { x, z, w: 0.6, d: 0.45, h: 3 }), braces(m, { x, z }))
  }
  floor.add(rebarMat(m, { x: 7, z: 9, w: 4, d: 3 }), formPanelStack(m, { x: -9, z: 6, angle: 0.4 }))
  floor.add(worker(m, { x: -2.6, z: -2.4, angle: 0.8 }), worker(m, { x: 3.4, z: 0.6, angle: -2.2, helmet: 'helmetYellow', bend: 0.4 }))
  scene.add(floor, buildingFrame(m, { floors: 2, baysX: 6, baysZ: 4 }))
  scene.add(towerCrane(m, { x: 22, z: -24, rotation: 2.6 }))
  const neighbour = buildingFrame(m, { floors: 6, baysX: 4, baysZ: 3, brickFloors: 4 })
  neighbour.position.set(-30, 0, -40)
  scene.add(neighbour, scaffold(m, { width: 17, height: 18, z: -32.7, x: -30 }))
  return { position: [-3.2, 7.65, 13.5], target: [1.2, 7.4, -2], fov: 60, roll: 0.012 }
}

/** Demir teslimi: kasası demir yüklü kamyon, yere indirilmiş demetler, çit. */
function rebarDelivery(scene) {
  landscape(scene)
  scene.add(truck(m, { x: 3, z: -4, angle: 0.35 }))
  for (let i = 0; i < 3; i++) scene.add(rebarBundle(m, { x: -2.2 + i * 0.5, z: 1.8 + i * 0.75, length: 11, angle: -0.5 + i * 0.04 }))
  scene.add(fence(m, { from: [-30, 0, -12], to: [30, 0, -10] }), worker(m, { x: -1.5, z: 1.4, angle: 2.1 }))
  const frame = buildingFrame(m, { floors: 4, baysX: 5, baysZ: 3 })
  frame.position.set(-14, 0, -30)
  scene.add(frame, scaffold(m, { width: 21, height: 12, z: -23, x: -14 }), towerCrane(m, { x: 18, z: -36, rotation: 3.4 }))
  return { position: [-6.8, 4.4, 6.6], target: [2, 0.7, -2.4], fov: 56, roll: -0.012 }
}

function siteOverview(scene, { floors, seaSide = false, baysX = 5 }) {
  landscape(scene, { seaSide })
  const frame = buildingFrame(m, { floors, baysX, baysZ: 3, brickFloors: Math.max(1, floors - 2) })
  scene.add(frame, scaffold(m, { width: baysX * 4.2 + 1, height: floors * 3 - 1, z: 6.6 }))
  scene.add(towerCrane(m, { x: baysX * 2.1 + 8, z: -8, height: floors * 3 + 16, rotation: 2.3 }))
  scene.add(fence(m, { from: [-40, 0, 24], to: [40, 0, 24] }), cementBags(m, { x: -14, z: 14 }), formPanelStack(m, { x: 10, z: 16 }))
  return { position: [-27, 10.5, 33], target: [1, floors * 1.25, 0], fov: 52, roll: 0.006 }
}

/** Alçı: 3. kat iç mekân, yarısı alçılanmış duvar, torbalar, sehpa. */
function plaster(scene) {
  scene.add(ground(m.concrete([6, 6]), 40))
  const back = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 0.2), m.brick([5, 1.2]))
  back.position.set(0, 1.5, -3)
  const done = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.9, 0.06), m.plaster)
  done.position.set(-2.9, 1.48, -2.86)
  const wet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.9, 0.05), m.wetPlaster)
  wet.position.set(1.9, 1.48, -2.87)
  const fill = new THREE.PointLight('#fff4e6', 40, 14, 1.4)
  fill.position.set(-1, 2.4, 2.5)
  scene.add(fill)
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(14, 0.25, 10), m.plaster)
  ceiling.position.set(0, 3.12, 1.5)
  for (const mesh of [back, done, wet, ceiling]) mesh.castShadow = mesh.receiveShadow = true
  scene.add(back, done, wet, ceiling, cementBags(m, { x: 3.6, z: -1.6, rows: 1, cols: 2, layers: 5 }))
  scene.add(shore(m, { x: 5.4, z: 2.5, h: 3 }), worker(m, { x: 2.4, z: -2.1, angle: Math.PI, bend: 0.15 }))
  return { position: [-1.2, 1.5, 2.4], target: [1.2, 1.35, -2.9], fov: 62, roll: 0.008 }
}

export const SHOTS = {
  'kolon-kaliplari': { build: columns, sun: [40, 70, 55] },
  'demir-teslim': { build: rebarDelivery, sun: [-50, 60, 40] },
  'santiye-yomra': { build: (scene) => siteOverview(scene, { floors: 4 }), sun: [50, 70, 60] },
  'santiye-kasustu': { build: (scene) => siteOverview(scene, { floors: 7, baysX: 4 }), sun: [-40, 75, 55] },
  'santiye-sahil': { build: (scene) => siteOverview(scene, { floors: 2, seaSide: true, baysX: 6 }), sun: [30, 50, 80] },
  'alci-3-kat': { build: plaster, sun: [-30, 18, 40], interior: true },
}
