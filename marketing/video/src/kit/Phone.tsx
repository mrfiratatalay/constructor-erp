import type { ReactNode } from 'react'
import { COLOR } from '../theme'
import type { Place } from './motion'

/**
 * Sade bir telefon (bir markanın kopyası değil). Uygulama çekimdeki gibi 393×764'tür; üstte saat çubuğu (54), altta
 * ev çizgisi payı (34) çerçeveye aittir. Saat çubuğundaki saati video söyler: sabah sahnesi 08:14'tür.
 */
export const PHONE = { app: { width: 393, height: 764 }, bezel: 14, status: 54, home: 34 } as const
export const PHONE_SIZE = { width: 393 + 2 * PHONE.bezel, height: 54 + 764 + 34 + 2 * PHONE.bezel } as const

/** Uygulamadaki bir noktanın dünyadaki yeri: kamera odakları ve ışık çizgisi için. */
export function phonePoint(place: Place, point: { x: number; y: number }) {
  return {
    x: place.x + place.scale * (PHONE.bezel + point.x - PHONE_SIZE.width / 2),
    y: place.y + place.scale * (PHONE.bezel + PHONE.status + point.y - PHONE_SIZE.height / 2),
  }
}

export const Phone: React.FC<{ place: Place; clock: string; children: ReactNode }> = ({ place, clock, children }) => (
  <div
    style={{
      position: 'absolute',
      left: place.x - PHONE_SIZE.width / 2,
      top: place.y - PHONE_SIZE.height / 2,
      width: PHONE_SIZE.width,
      height: PHONE_SIZE.height,
      padding: PHONE.bezel,
      borderRadius: 68,
      background: COLOR.device,
      boxShadow: '0 50px 100px rgb(0 0 0 / 0.45), inset 0 0 0 2px #313a52, inset 0 0 0 5px #0a0e1a',
      transform: `scale(${place.scale})`,
    }}
  >
    <div style={{ position: 'relative', height: '100%', borderRadius: 54, overflow: 'hidden', background: COLOR.white }}>
      <StatusBar clock={clock} />
      <div style={{ position: 'absolute', left: 0, top: PHONE.status, ...PHONE.app, overflow: 'hidden' }}>
        {children}
      </div>
      <div style={{ position: 'absolute', left: 129.5, bottom: 9, width: 134, height: 5, borderRadius: 3, background: COLOR.ink }} />
    </div>
  </div>
)

const StatusBar: React.FC<{ clock: string }> = ({ clock }) => (
  <div style={{ position: 'absolute', inset: '0 0 auto 0', height: PHONE.status, color: COLOR.ink }}>
    <span style={{ position: 'absolute', left: 50, top: 17, fontSize: 17, fontWeight: 700 }}>{clock}</span>
    <div style={{ position: 'absolute', left: 134.5, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000' }} />
    <svg style={{ position: 'absolute', right: 26, top: 21 }} width="76" height="14" viewBox="0 0 76 14">
      {[4, 7, 10, 13].map((height, index) => (
        <rect key={height} x={index * 5} y={13 - height} width="3.2" height={height} rx="1" fill={COLOR.ink} />
      ))}
      <path d="M27 5.2a10 10 0 0 1 14 0l-1.6 1.6a7.7 7.7 0 0 0-10.8 0zM30.2 8.4a5.5 5.5 0 0 1 7.6 0L34 12.2z" fill={COLOR.ink} />
      <rect x="47" y="1.5" width="25" height="11" rx="3.4" fill="none" stroke={COLOR.ink} strokeOpacity="0.45" />
      <rect x="49" y="3.5" width="19" height="7" rx="1.8" fill={COLOR.ink} />
      <rect x="73.3" y="5" width="1.8" height="4" rx="0.9" fill={COLOR.ink} fillOpacity="0.45" />
    </svg>
  </div>
)
