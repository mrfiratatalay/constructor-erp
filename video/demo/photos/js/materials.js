// Sahnenin malzemeleri tek yerde: her parça aynı betonu, aynı kalıbı kullanır, fotoğraf tutarlı görünür.
import * as THREE from 'three'
import { brick, concrete, plywood, soil } from './textures.js'

function textured(map, repeat, options = {}) {
  const texture = map.clone()
  texture.repeat.set(repeat[0], repeat[1])
  texture.needsUpdate = true
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92, metalness: 0, ...options })
}

export function createMaterials() {
  const concreteMap = concrete(11)
  const plyMap = plywood(12)
  return {
    concrete: (repeat = [1, 1]) => textured(concreteMap, repeat),
    oldConcrete: (repeat = [1, 1]) => textured(concrete(13, '#9b9a93'), repeat),
    plywood: (repeat = [1, 1]) => textured(plyMap, repeat, { roughness: 0.7 }),
    filmPly: (repeat = [1, 1]) => textured(plywood(14, '#8a4a2b'), repeat, { roughness: 0.55 }),
    soil: (repeat = [8, 8]) => textured(soil(15), repeat, { roughness: 1 }),
    brick: (repeat = [1, 1]) => textured(brick(16), repeat),
    rebar: new THREE.MeshStandardMaterial({ color: '#56463c', roughness: 0.55, metalness: 0.6 }),
    roof: new THREE.MeshStandardMaterial({ color: '#a4472c', roughness: 0.85 }),
    grass: new THREE.MeshStandardMaterial({ color: '#6f8458', roughness: 1 }),
    steel: new THREE.MeshStandardMaterial({ color: '#4b5563', roughness: 0.5, metalness: 0.6 }),
    galvanized: new THREE.MeshStandardMaterial({ color: '#b8bcc0', roughness: 0.45, metalness: 0.7 }),
    craneYellow: new THREE.MeshStandardMaterial({ color: '#f2b705', roughness: 0.55, metalness: 0.2 }),
    propRed: new THREE.MeshStandardMaterial({ color: '#b4362b', roughness: 0.5, metalness: 0.3 }),
    beamYellow: new THREE.MeshStandardMaterial({ color: '#e0b23a', roughness: 0.6 }),
    timber: new THREE.MeshStandardMaterial({ color: '#b98b55', roughness: 0.85 }),
    truckWhite: new THREE.MeshStandardMaterial({ color: '#e8eaec', roughness: 0.35, metalness: 0.3 }),
    truckBlue: new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.4, metalness: 0.3 }),
    tyre: new THREE.MeshStandardMaterial({ color: '#1f2023', roughness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.1, metalness: 0.8 }),
    hill: new THREE.MeshStandardMaterial({ color: '#56704a', roughness: 1, flatShading: true }),
    hillFar: new THREE.MeshStandardMaterial({ color: '#7d9277', roughness: 1, flatShading: true }),
    sea: new THREE.MeshStandardMaterial({ color: '#2f5d7c', roughness: 0.25, metalness: 0.4 }),
    plaster: new THREE.MeshStandardMaterial({ color: '#efece6', roughness: 0.95 }),
    wetPlaster: new THREE.MeshStandardMaterial({ color: '#dcd8cf', roughness: 0.8 }),
    bagPaper: new THREE.MeshStandardMaterial({ color: '#d8cbb0', roughness: 0.95 }),
    vest: new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.8 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#2b3442', roughness: 0.95 }),
    skin: new THREE.MeshStandardMaterial({ color: '#b98a6a', roughness: 0.8 }),
    helmetWhite: new THREE.MeshStandardMaterial({ color: '#f5f5f4', roughness: 0.4 }),
    helmetYellow: new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 }),
    fence: new THREE.MeshStandardMaterial({ color: '#1e3a5f', roughness: 0.7 }),
    netGreen: new THREE.MeshStandardMaterial({ color: '#3f7d4e', roughness: 0.9, transparent: true, opacity: 0.55 }),
  }
}
