import type { CSSProperties, ReactNode } from 'react'
import { Img } from 'remotion'
import type { Box } from './useCapture'

/** Masaüstü çekimlerinin penceresi: tarayıcı görünümü 1440×900 CSS pikseli, üstünde ince bir başlık şeridi. */
export const VIEWPORT = { width: 1440, height: 900 }
export const TITLE_BAR = 32

/** Pencerenin filmdeki yeri: görünümün sol üst köşesi (video pikseli) ve ölçeği. */
export type WindowPlacement = { x: number; y: number; scale: number }

/** Bir çekim kutusunu (CSS pikseli) videodaki yerine çevirir: imleç ve kamera bunu kullanır. */
export const toVideo = (box: Box, placement: WindowPlacement): Box => ({
  x: placement.x + box.x * placement.scale,
  y: placement.y + box.y * placement.scale,
  width: box.width * placement.scale,
  height: box.height * placement.scale,
})

export const centerOf = (box: Box): { x: number; y: number } => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })

type Props = {
  placement: WindowPlacement
  src?: string
  style?: CSSProperties
  /** Görüntünün üstüne çizilecek katmanlar (CSS pikseli koordinatında). */
  children?: ReactNode
}

/**
 * Temiz uygulama penceresi: yuvarlak köşe, derin gölge, sahte adres çubuğu yok (spesifikasyon Madde 9).
 * Kareler 2x çekildiği için pencere büyütülse de yazılar keskin kalır.
 */
export const AppWindow = ({ placement, src, style, children }: Props) => (
  <div style={{ position: 'absolute', left: placement.x, top: placement.y - TITLE_BAR * placement.scale,
    width: VIEWPORT.width, height: VIEWPORT.height + TITLE_BAR, transform: `scale(${placement.scale})`,
    transformOrigin: '0 0', borderRadius: 14, overflow: 'hidden', background: '#0b1328',
    boxShadow: '0 50px 120px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(255 255 255 / 0.08)', ...style }}>
    <div style={{ height: TITLE_BAR, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px' }}>
      {[0, 1, 2].map((dot) => (
        <div key={dot} style={{ width: 11, height: 11, borderRadius: 6, background: 'rgb(255 255 255 / 0.16)' }} />
      ))}
    </div>
    <div style={{ position: 'relative', width: VIEWPORT.width, height: VIEWPORT.height, background: '#fff' }}>
      {src && <Img src={src} style={{ width: VIEWPORT.width, height: VIEWPORT.height, display: 'block' }} />}
      {children}
    </div>
  </div>
)
