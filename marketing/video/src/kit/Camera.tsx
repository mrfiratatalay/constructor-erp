import type { ReactNode } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { STAGE } from '../theme'
import { placeAt, type Place, type Pose } from './motion'

/**
 * Sahnenin kamerası: yerin (x, y) noktası ekranın ortasına gelir, scale kadar büyür. Kamera yerinde durmaz; izleyen
 * nereye bakacağını hiç aramasın diye hep o anda olan şeye yaklaşır.
 */
export const Camera: React.FC<{ poses: Pose[]; children: ReactNode }> = ({ poses, children }) => {
  const frame = useCurrentFrame()
  const { x, y, scale } = placeAt(frame, poses)
  return (
    <AbsoluteFill
      style={{
        transformOrigin: '0 0',
        transform: `translate(${STAGE.width / 2 - x * scale}px, ${STAGE.height / 2 - y * scale}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

/** Dünyadaki bir noktanın o anki ekrandaki yeri: kameranın dışında çizilen şeyler (uçan dosya) için. */
export function toScreen(point: { x: number; y: number }, camera: Place) {
  return {
    x: STAGE.width / 2 + (point.x - camera.x) * camera.scale,
    y: STAGE.height / 2 + (point.y - camera.y) * camera.scale,
  }
}
