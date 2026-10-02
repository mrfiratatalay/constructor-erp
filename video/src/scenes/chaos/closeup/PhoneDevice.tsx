import type { ReactNode } from 'react'

export const PHONE_SCREEN = { width: 390, height: 844 }

type Props = {
  x: number
  y: number
  scale: number
  angle?: number
  shake?: { x: number; y: number; angle: number }
  children: ReactNode
}

/**
 * Masada yatan genel bir telefon, kuşbakışı: ince çerçeve, ön kamera deliği, camda hafif yansıma. Marka yok.
 * Ekran içeriği 390×844 CSS pikselinde çizilir, telefonla birlikte ölçeklenir.
 */
export const PhoneDevice = ({ x, y, scale, angle = 0, shake, children }: Props) => {
  const jitter = shake ?? { x: 0, y: 0, angle: 0 }
  const { width, height } = PHONE_SCREEN
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: width + 28, height: height + 28,
      transform: `translate(-50%, -50%) translate(${jitter.x * 3}px, ${jitter.y * 3}px) rotate(${angle + jitter.angle}deg) scale(${scale})`,
      borderRadius: 58, background: 'linear-gradient(145deg, #2d323d, #0d0f14)',
      boxShadow: '0 50px 80px rgb(0 0 0 / 0.55), 0 12px 24px rgb(0 0 0 / 0.4), inset 0 0 0 2px #3d4350' }}>
      <div style={{ position: 'absolute', left: 14, top: 14, width, height, borderRadius: 46, overflow: 'hidden',
        background: '#000' }}>
        {children}
        <div style={{ position: 'absolute', left: width / 2 - 6, top: 13, width: 12, height: 12, borderRadius: 6,
          background: '#05060a' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(125deg, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0) 34%, rgb(255 230 190 / 0.05) 70%)' }} />
      </div>
    </div>
  )
}
