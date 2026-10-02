// Ürün çekimlerinin ortak sahnesi: blueprint zemin, kamera, uygulama penceresi ya da telefon. Bölüm, öncekinin
// üzerine kısa bir yükselme ve çözülmeyle gelir (enter), böylece kesmeler sert değil, akıcıdır.
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import type { ClipName } from '../clips.generated'
import { AppWindow } from './AppWindow'
import { Backdrop } from './Backdrop'
import { Camera, type CameraKeys } from './Camera'
import type { Key } from './keys'
import { Phone } from './Phone'

export const ENTER = 0.35

export const Enter: React.FC<{ children: React.ReactNode; from?: 'rise' | 'fade' | 'none' }> = ({ children, from = 'rise' }) => {
  const t = useCurrentFrame() / 30
  const k = from === 'none' ? 1 : interpolate(t, [0, ENTER], [0, 1], { extrapolateRight: 'clamp' })
  const eased = 1 - (1 - k) ** 3
  return (
    <AbsoluteFill style={{ opacity: eased, transform: from === 'rise' ? `translateY(${(1 - eased) * 36}px) scale(${0.985 + eased * 0.015})` : undefined }}>
      {children}
    </AbsoluteFill>
  )
}

export const DesktopShot: React.FC<{ clip: ClipName; map: Key[]; camera?: CameraKeys; from?: 'rise' | 'fade' | 'none'; backdrop?: boolean }> = ({
  clip, map, camera = {}, from = 'rise', backdrop = true,
}) => (
  <AbsoluteFill>
    {backdrop && <Backdrop />}
    <Enter from={from}>
      <Camera keys={camera}><AppWindow name={clip} map={map} /></Camera>
    </Enter>
  </AbsoluteFill>
)

export const PhoneShot: React.FC<{ clip: ClipName; map: Key[]; camera?: CameraKeys; from?: 'rise' | 'fade' | 'none'; height?: number }> = ({
  clip, map, camera = {}, from = 'rise', height = 940,
}) => (
  <AbsoluteFill>
    <Backdrop glow={[70, 20]} />
    <Enter from={from}>
      <Camera keys={camera}>
        <Phone name={clip} map={map} height={height} style={{ left: 960 - (height * 390) / 844 / 2 - height * 0.016, top: (1080 - height) / 2 - height * 0.016 }} />
      </Camera>
    </Enter>
  </AbsoluteFill>
)
