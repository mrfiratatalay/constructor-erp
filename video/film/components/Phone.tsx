// Telefon: sade, markasız bir gövde (koyu çerçeve, ince kenar ışığı, çentik). Ekranda telefon çekimi oynar.
import { Clip } from './Clip'
import type { Key } from './keys'
import type { ClipName } from '../clips.generated'

export const Phone: React.FC<{ name: ClipName; map: Key[]; height?: number; style?: React.CSSProperties }> = ({
  name, map, height = 900, style,
}) => {
  const width = (height * 390) / 844
  const bezel = height * 0.016
  return (
    <div style={{ position: 'absolute', width: width + bezel * 2, height: height + bezel * 2, borderRadius: height * 0.075,
      background: 'linear-gradient(145deg, #2a3142, #0d111a 60%)', padding: bezel,
      boxShadow: '0 40px 90px rgba(2,6,23,0.6), inset 0 0 0 1.5px rgba(255,255,255,0.12)', ...style }}>
      <div style={{ position: 'relative', width, height, borderRadius: height * 0.062, overflow: 'hidden', background: '#fff' }}>
        <Clip name={name} map={map} />
        <div style={{ position: 'absolute', top: height * 0.012, left: '50%', width: width * 0.3, height: height * 0.034,
          transform: 'translateX(-50%)', borderRadius: 999, background: '#05070c' }} />
      </div>
    </div>
  )
}
