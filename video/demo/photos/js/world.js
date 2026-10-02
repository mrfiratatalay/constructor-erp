// Fotoğrafın dünyası: renderer, gökyüzü kubbesi, zemin, güneş ve sis; sonra telefon kamerası hissi (gren, vinyet).
import * as THREE from 'three'
import { sky } from './textures.js'

export function createWorld({ width, height, sun = [60, 80, 40], warmth = '#fff1dc', fog = '#dfe3df' }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(1)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(fog, 45, 620)
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.MeshBasicMaterial({ map: sky(), side: THREE.BackSide, fog: false }))
  scene.add(dome)

  const light = new THREE.DirectionalLight(warmth, 3.1)
  light.position.set(...sun)
  light.castShadow = true
  light.shadow.mapSize.set(4096, 4096)
  Object.assign(light.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 400 })
  light.shadow.bias = -0.0004
  light.shadow.normalBias = 0.02
  scene.add(light, new THREE.HemisphereLight('#cfe0f2', '#7a6a55', 1.25))
  return { renderer, scene, light }
}

export function ground(material, size = 3000) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material)
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  return mesh
}

/** Kamerayı göz hizasında, hafif eğik tutar: elde çekilmiş telefon fotoğrafı. */
export function phoneCamera({ width, height, position, target, fov = 62, roll = 0 }) {
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.05, 4000)
  camera.position.set(...position)
  camera.lookAt(new THREE.Vector3(...target))
  camera.rotateZ(roll)
  return camera
}

/** Gren, vinyet ve hafif sıcak renk: render "temiz bilgisayar görüntüsü" gibi durmasın. */
export function develop(sourceCanvas, { grain = 9, vignette = 0.32, seed = 7 }) {
  const { width, height } = sourceCanvas
  const out = document.createElement('canvas')
  out.width = width
  out.height = height
  const ctx = out.getContext('2d')
  ctx.drawImage(sourceCanvas, 0, 0)
  ctx.globalCompositeOperation = 'soft-light'
  ctx.fillStyle = 'rgba(255,214,170,0.18)'
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
  const shade = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.35, width / 2, height / 2, Math.hypot(width, height) / 1.9)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, `rgba(0,0,0,${vignette})`)
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, width, height)
  const image = ctx.getImageData(0, 0, width, height)
  let s = seed
  for (let i = 0; i < image.data.length; i += 4) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const n = ((s / 0x7fffffff) - 0.5) * grain
    image.data[i] += n
    image.data[i + 1] += n
    image.data[i + 2] += n
  }
  ctx.putImageData(image, 0, 0)
  return out
}
