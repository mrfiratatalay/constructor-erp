// İskele ERP imzası: ürünün mevcut vinç işareti (ProductMark.vue ile aynı çizim) ve "İskele ERP" yazısı.
// Yeni bir logo icat edilmez; koyu zeminde sarı kare içinde lacivert vinç, "ERP" baret sarısı.
import { COLOR, FONT } from '../theme'

export const CraneMark: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: COLOR.signature, display: 'grid', placeItems: 'center' }}>
    <svg viewBox="0 0 32 32" width={size * 0.66} height={size * 0.66} fill="none" stroke={COLOR.deep} strokeWidth={2.6}
      strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 60, strokeDashoffset: 60 * (1 - draw) }}>
      <path d="M10 26V8" /><path d="M6 8h20" /><path d="M10 8l4.5-4" /><path d="M22 8v6" />
      <path d="M20 14h4v3.5h-4z" /><path d="M6.5 26h7" />
    </svg>
  </div>
)

export const Wordmark: React.FC<{ size?: number; draw?: number; reveal?: number }> = ({ size = 96, draw = 1, reveal = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32, fontFamily: FONT }}>
    <CraneMark size={size} draw={draw} />
    <div style={{ overflow: 'hidden', clipPath: `inset(0 ${100 - reveal * 100}% 0 0)` }}>
      <span style={{ fontSize: size * 0.82, fontWeight: 700, letterSpacing: '-0.035em', color: COLOR.white, whiteSpace: 'nowrap' }}>
        İskele <b style={{ fontWeight: 800, color: COLOR.signature }}>ERP</b>
      </span>
    </div>
  </div>
)
