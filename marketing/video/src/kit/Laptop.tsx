import type { ReactNode } from 'react'
import { COLOR } from '../theme'
import type { Place } from './motion'

/**
 * Sade bir dizüstü. Uygulama çekimdeki gibi 1470×920'dir (TASARIM.md'nin ölçtüğü dizüstü genişliği). Yer, kapak ile
 * gövdenin birlikte kapladığı kutunun ortasıdır.
 */
export const LAPTOP = { app: { width: 1470, height: 920 }, bezel: 22, top: 28 } as const
const LID = { width: 1470 + 2 * LAPTOP.bezel, height: 920 + LAPTOP.top + LAPTOP.bezel }
export const LAPTOP_SIZE = { width: 1700, height: LID.height + 32 } as const
const LID_LEFT = (LAPTOP_SIZE.width - LID.width) / 2

/** Uygulamadaki bir noktanın dünyadaki yeri. */
export function laptopPoint(place: Place, point: { x: number; y: number }) {
  return {
    x: place.x + place.scale * (LID_LEFT + LAPTOP.bezel + point.x - LAPTOP_SIZE.width / 2),
    y: place.y + place.scale * (LAPTOP.top + point.y - LAPTOP_SIZE.height / 2),
  }
}

export const Laptop: React.FC<{ place: Place; children: ReactNode }> = ({ place, children }) => (
  <div
    style={{
      position: 'absolute',
      left: place.x - LAPTOP_SIZE.width / 2,
      top: place.y - LAPTOP_SIZE.height / 2,
      ...LAPTOP_SIZE,
      transform: `scale(${place.scale})`,
      filter: 'drop-shadow(0 50px 70px rgb(0 0 0 / 0.45))',
    }}
  >
    <Lid>{children}</Lid>
    <Base />
  </div>
)

const Lid: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      left: LID_LEFT,
      top: 0,
      ...LID,
      borderRadius: '30px 30px 14px 14px',
      background: COLOR.device,
      boxShadow: 'inset 0 0 0 2px #313a52',
    }}
  >
    <div style={{ position: 'absolute', left: LID.width / 2 - 5, top: 10, width: 10, height: 10, borderRadius: 5, background: '#1f2940' }} />
    <div
      style={{
        position: 'absolute',
        left: LAPTOP.bezel,
        top: LAPTOP.top,
        ...LAPTOP.app,
        overflow: 'hidden',
        borderRadius: 6,
        background: COLOR.canvas,
      }}
    >
      {children}
    </div>
  </div>
)

const Base: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: LID.height - 2,
      width: LAPTOP_SIZE.width,
      height: 34,
      borderRadius: '4px 4px 22px 22px',
      background: 'linear-gradient(#e6e9ef, #b7bfcd 55%, #8e97a8)',
    }}
  >
    <div style={{ position: 'absolute', left: LAPTOP_SIZE.width / 2 - 120, top: 0, width: 240, height: 10, borderRadius: '0 0 10px 10px', background: '#c3cad6' }} />
  </div>
)
