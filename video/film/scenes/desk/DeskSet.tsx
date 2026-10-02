// Şantiye ofisindeki masa, gerçek perspektifle (CSS 3B): arkada pencere ve şantiye, masa düzleminde dizüstü (ekranı
// açılı durur), telefon, proje paftası ve kâğıtlar. Ekran içerikleri dışarıdan verilir: açılışta dağınık eski dünya,
// kapanışta gerçek İskele ERP ekranı.
import { useCurrentFrame } from 'remotion'
import { COLOR } from '../../theme'
import { SiteWindow } from './SiteWindow'

const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...style })

const Room: React.FC<{ calm: boolean }> = ({ calm }) => (
  <div style={abs({ inset: 0, background: 'linear-gradient(180deg, #313a4b 0%, #262d3b 60%, #1c222d 100%)' })}>
    <div style={abs({ left: 150, top: 46, width: 1620, height: 600, overflow: 'hidden', borderRadius: 6 })}>
      <SiteWindow calm={calm} viewBox="0 300 1920 711" width={1620} height={600} />
      <div style={abs({ left: 0, top: 0, right: 0, bottom: 0, boxShadow: 'inset 0 0 0 14px #1b212c, inset 0 0 60px rgba(0,0,0,0.35)' })} />
      <div style={abs({ left: 795, top: 0, width: 16, height: 600, background: '#1b212c' })} />
      <div style={abs({ left: 0, top: 290, width: 1620, height: 12, background: '#1b212c' })} />
    </div>
    <div style={abs({ left: 120, top: 640, width: 1680, height: 22, background: '#3a4253', boxShadow: '0 8px 18px rgba(0,0,0,0.35)' })} />
    <div style={abs({ inset: 0, background: 'linear-gradient(115deg, transparent 30%, rgba(255,226,180,0.10) 45%, transparent 60%)', mixBlendMode: 'screen' })} />
  </div>
)

const Laptop: React.FC<{ screen: React.ReactNode }> = ({ screen }) => (
  <div style={abs({ left: 860, top: 130, width: 600, height: 400, transformStyle: 'preserve-3d' })}>
    <div style={abs({ inset: 0, borderRadius: 18, background: 'linear-gradient(180deg, #c9ced6, #9aa2ae)', boxShadow: '0 30px 50px rgba(0,0,0,0.45)' })}>
      <div style={abs({ left: 48, top: 40, width: 504, height: 210, borderRadius: 8, background: 'repeating-linear-gradient(90deg, #8b939f 0 36px, #9aa1ac 36px 39px)', opacity: 0.6 })} />
      <div style={abs({ left: 225, top: 280, width: 150, height: 92, borderRadius: 9, background: '#a8afba' })} />
    </div>
    <div style={abs({ left: 6, top: -375, width: 588, height: 378, transformOrigin: '50% 100%', transform: 'rotateX(-102deg)',
      borderRadius: '16px 16px 5px 5px', background: '#0e1118', padding: 12, boxShadow: '0 0 0 2px #2a2f3a' })}>
      <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>{screen}</div>
    </div>
  </div>
)

const PhoneOnDesk: React.FC<{ screen: React.ReactNode; buzz: number }> = ({ screen, buzz }) => {
  const shake = buzz > 0 ? Math.sin(useCurrentFrame() * 2.6) * 4 * buzz : 0
  return (
    <div style={abs({ left: 1760, top: 230, width: 200, height: 410, borderRadius: 30, background: '#11151d', padding: 8,
      transform: `rotateZ(-14deg) translate(${shake}px, ${shake * 0.4}px)`, boxShadow: '0 30px 40px rgba(0,0,0,0.5), inset 0 0 0 2px #2c3240' })}>
      <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', background: '#0b0f17' }}>{screen}</div>
    </div>
  )
}

const Blueprint: React.FC = () => (
  <div style={abs({ left: 760, top: 420, width: 820, height: 540, transform: 'rotateZ(-5deg)', background: '#1d4d8f',
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
    backgroundSize: '40px 40px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' })}>
    <svg viewBox="0 0 1100 720" style={abs({ inset: 0 })} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={3}>
      <rect x="120" y="90" width="640" height="420" /><path d="M120 300 H760 M440 90 V510 M600 300 V510" />
      <path d="M800 120 H1020 M800 160 H980 M800 200 H1000" strokeWidth={2} />
    </svg>
  </div>
)

export interface DeskProps {
  laptop: React.ReactNode
  phone: React.ReactNode
  papers?: React.ReactNode
  calm?: boolean
  buzz?: number
}

/** Masa düzlemi: üst kenar uzakta. Çocukların koordinatları masa düzlemindedir (piksel). */
export const DeskSet: React.FC<DeskProps> = ({ laptop, phone, papers, calm = false, buzz = 0 }) => (
  <div style={abs({ inset: 0, overflow: 'hidden', background: COLOR.ink })}>
    <Room calm={calm} />
    <div style={abs({ left: 0, top: 0, width: 1920, height: 1080, perspective: 2200, perspectiveOrigin: '50% 20%' })}>
      <div style={abs({ left: -240, top: 652, width: 2400, height: 1500, transformOrigin: '50% 0%', transform: 'rotateX(68deg)',
        transformStyle: 'preserve-3d', background: 'linear-gradient(180deg, #6b5643 0%, #4d3c2f 70%)',
        boxShadow: 'inset 0 30px 60px rgba(255,220,170,0.18)' })}>
        <div style={abs({ inset: 0, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 3px, transparent 3px 60px)' })} />
        <Blueprint />
        {papers}
        <Laptop screen={laptop} />
        <PhoneOnDesk screen={phone} buzz={buzz} />
      </div>
    </div>
  </div>
)
