// Kamera: içeriği yakınlaştırır, kaydırır, çok hafif eğer. Anahtarlar saniye cinsinden, sahnenin başından.
// scale 1 → 1.12/1.18 gibi okunur kalan yakınlaşmalar; ox/oy: odak noktası (içeriğin yüzdesi).
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { type Key, valueAt } from './keys'

export interface CameraKeys {
  scale?: Key[]
  ox?: Key[]
  oy?: Key[]
  rotateX?: Key[]
  rotateY?: Key[]
  x?: Key[]
  y?: Key[]
}

const at = (keys: Key[] | undefined, t: number, fallback: number) => (keys ? valueAt(keys, t) : fallback)

export const Camera: React.FC<{ keys: CameraKeys; children: React.ReactNode }> = ({ keys, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps
  const transform = `translate(${at(keys.x, t, 0)}px, ${at(keys.y, t, 0)}px) perspective(2400px) ` +
    `rotateX(${at(keys.rotateX, t, 0)}deg) rotateY(${at(keys.rotateY, t, 0)}deg) scale(${at(keys.scale, t, 1)})`
  return (
    <div style={{ position: 'absolute', inset: 0, transform, transformOrigin: `${at(keys.ox, t, 50)}% ${at(keys.oy, t, 50)}%` }}>
      {children}
    </div>
  )
}
