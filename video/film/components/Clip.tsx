// Çekilmiş ürün klibi, kare kare: filmin her karesinde klibin hangi anı gösterileceği zaman eşlemesiyle seçilir
// (map: [filmSaniyesi, klipSaniyesi]). Aynı klip zamanı iki anahtar arasında = dondurma; eğim = hız. Aynı film anında
// iki anahtar = atlama kesmesi: yeni kare, eskisinin üzerine 5 karede çözülerek gelir.
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { CLIPS, type ClipName } from '../clips.generated'
import { type Key, valueAt } from './keys'

const DISSOLVE = 5 / 30

function frameAt(name: ClipName, seconds: number): number {
  return Math.min(CLIPS[name].frames, Math.max(1, Math.round(seconds * 30) + 1))
}

const src = (name: ClipName, n: number) => staticFile(`clips/${name}/${String(n).padStart(6, '0')}.jpg`)
const fill: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }

/** Bu anın hemen öncesinde bir atlama kesmesi varsa, kesmeden önceki klip zamanı ve geçişin ilerlemesi. */
function jumpBefore(map: Key[], t: number): { from: number; progress: number } | null {
  for (let i = 1; i < map.length; i++) {
    const at = map[i][0]
    if (at === map[i - 1][0] && t >= at && t < at + DISSOLVE) return { from: map[i - 1][1], progress: (t - at) / DISSOLVE }
  }
  return null
}

export const Clip: React.FC<{ name: ClipName; map: Key[] }> = ({ name, map }) => {
  const t = useCurrentFrame() / useVideoConfig().fps
  const jump = jumpBefore(map, t)
  const now = frameAt(name, valueAt(map, t, false))
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {jump && <Img src={src(name, frameAt(name, jump.from))} style={fill} />}
      <Img src={src(name, now)} style={{ ...fill, opacity: jump ? jump.progress : 1 }} />
    </div>
  )
}
