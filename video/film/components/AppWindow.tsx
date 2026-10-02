// Masaüstü ekranının çerçevesi: temiz, köşeleri yuvarlak uygulama penceresi (sahte adres çubuğu yok), derin gölge.
import { Clip } from './Clip'
import type { Key } from './keys'
import type { ClipName } from '../clips.generated'

export const WINDOW = { width: 1600, height: 1000 }

export const AppWindow: React.FC<{ name: ClipName; map: Key[]; left?: number; top?: number; width?: number }> = ({
  name, map, left, top, width = WINDOW.width,
}) => {
  const height = (width * 900) / 1440
  return (
    <div style={{ position: 'absolute', width, height, left: left ?? (1920 - width) / 2, top: top ?? (1080 - height) / 2,
      borderRadius: 18, overflow: 'hidden', background: '#fff',
      boxShadow: '0 50px 120px rgba(2,6,23,0.55), 0 12px 30px rgba(2,6,23,0.35), 0 0 0 1px rgba(255,255,255,0.08)' }}>
      <Clip name={name} map={map} />
    </div>
  )
}
