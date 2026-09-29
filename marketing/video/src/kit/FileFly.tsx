import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { mix, progress, settle } from './motion'

type Point = { x: number; y: number }

/**
 * İndirilen dosya: düğmenin yerinden çıkar, dönerek büyür ve ekranın ortasına oturur. Altında adı ve içindeki
 * sayfalar yazar (uygulamanın Excel'i gerçekten bu üç sayfadır). Kameranın dışında, ekran üzerinde çizilir.
 */
export const FileFly: React.FC<{ from: Point; to: Point; name: string; sheets: string[]; start: number }> = ({
  from,
  to,
  name,
  sheets,
  start,
}) => {
  const frame = useCurrentFrame()
  const flight = progress(frame, start, start + 22, settle)
  if (frame < start) return null
  const float = Math.sin((frame - start) / 12) * 6
  return (
    <div
      style={{
        position: 'absolute',
        left: mix(from.x, to.x, flight),
        top: mix(from.y, to.y, flight) + float * flight,
        display: 'grid',
        justifyItems: 'center',
        gap: 18,
        transform: `translate(-50%, -50%) scale(${mix(0.15, 1, flight)}) rotate(${mix(-18, 0, flight)}deg)`,
        opacity: Math.min(1, flight * 3),
      }}
    >
      <SheetIcon />
      <div style={{ padding: '10px 22px', borderRadius: 14, background: COLOR.white, color: COLOR.ink, fontSize: 30, fontWeight: 800 }}>
        {name}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {sheets.map((sheet) => (
          <span key={sheet} style={{ padding: '6px 16px', borderRadius: 999, background: 'rgb(255 255 255 / 0.16)', color: COLOR.white, fontSize: 22, fontWeight: 700 }}>
            {sheet}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Sade bir tablo dosyası simgesi (bir ürünün logosu değil): yeşil başlık, ızgara, içinde işaretler. */
const SheetIcon: React.FC = () => (
  <svg width="190" height="236" viewBox="0 0 190 236" style={{ filter: 'drop-shadow(0 24px 40px rgb(0 0 0 / 0.45))' }}>
    <path d="M14 0h122l54 54v168a14 14 0 0 1-14 14H14A14 14 0 0 1 0 222V14A14 14 0 0 1 14 0z" fill={COLOR.white} />
    <path d="M136 0l54 54h-40a14 14 0 0 1-14-14z" fill="#d6dce7" />
    <rect x="0" y="70" width="190" height="44" fill={COLOR.success} />
    <text x="95" y="101" textAnchor="middle" fill={COLOR.white} fontSize="26" fontWeight="800" fontFamily="inherit">
      XLSX
    </text>
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((column) => (
        <g key={`${row}-${column}`}>
          <rect x={22 + column * 38} y={132 + row * 30} width="32" height="22" rx="4" fill="#eef1f5" />
          <circle cx={38 + column * 38} cy={143 + row * 30} r="6" fill={(row + column) % 5 === 3 ? '#b91c1c' : COLOR.successBright} />
        </g>
      )),
    )}
  </svg>
)
