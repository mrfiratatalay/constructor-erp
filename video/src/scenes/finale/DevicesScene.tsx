import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import { brand } from '../../theme/colors'
import { SANS } from '../../theme/fonts'
import { easeOutCubic, keyframes, progress } from '../../motion/ease'
import { AppWindow } from '../../ui/AppWindow'
import { FrameTrack } from '../../ui/FrameTrack'
import { Highlight } from '../../ui/Highlight'
import { BlueprintGrid } from '../brand/BlueprintGrid'
import { PhoneDevice } from '../chaos/closeup/PhoneDevice'
import { Links } from './Links'

const LEAD = { x: 360, y: 548, scale: 0.9 }
const DEPOT = { x: 810, y: 548, scale: 0.9 }
const OFFICE = { x: 1110, y: 330, scale: 0.52 }

/** Rolün adı, cihazın altında. "Herkes rolü kadar görür" derken sırayla parlar. */
const RoleChip = ({ x, y, label, glow, shown }: { x: number; y: number; label: string; glow: number; shown: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', padding: '10px 20px', borderRadius: 999, opacity: shown,
    fontFamily: SANS, fontSize: 22, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', background: 'rgb(16 30 59 / 0.85)',
    border: `2px solid rgb(250 204 21 / ${0.25 + glow * 0.75})`, boxShadow: `0 0 ${glow * 28}px rgb(250 204 21 / ${glow * 0.5})` }}>
    {label}
  </div>
)

const enterOf = (t: number, at: number) => progress(t, at, 0.6, easeOutCubic)

/**
 * 95,5 – 106,6 sn: "Saha telefondan günceller. Depo hareketi kaydeder. Ofis bilgisayardan bütünü takip eder.
 * Herkes rolü kadar görür; herkes aynı işin içinde kalır." Aynı kayıt (24 kalıp paneli) üç ekranda birden.
 */
export const DevicesScene = () => {
  const t = useFilmTime()
  const [lead, depot, office] = [enterOf(t, 95.5), enterOf(t, 97.75), enterOf(t, 99.65)]
  const pulse = (at: number) => progress(t, at, 0.3) * (1 - progress(t, at + 0.9, 0.4))
  const push = keyframes(t, [[95.5, 1], [106.6, 1.06]])
  return (
    <AbsoluteFill style={{ opacity: progress(t, 95.4, 0.5) }}>
      <BlueprintGrid drift={-t * 4} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Links shown={progress(t, 100.3, 0.8)} />
        <div style={{ opacity: lead, transform: `translateY(${(1 - lead) * 60}px)` }}>
          <PhoneDevice {...LEAD}><FrameTrack frames={[{ at: 0, src: 'devices/phone-field' }]} /></PhoneDevice>
        </div>
        <div style={{ opacity: depot, transform: `translateY(${(1 - depot) * 60}px)` }}>
          <PhoneDevice {...DEPOT}><FrameTrack frames={[{ at: 0, src: 'devices/phone-materials' }]} /></PhoneDevice>
        </div>
        <div style={{ opacity: office, transform: `translateY(${(1 - office) * 60}px)` }}>
          <AppWindow placement={OFFICE}><FrameTrack frames={[{ at: 0, src: 'devices/desktop-field' }]} /></AppWindow>
        </div>
        <RoleChip x={LEAD.x} y={970} label="Şef · saha" glow={pulse(102.6)} shown={lead} />
        <RoleChip x={DEPOT.x} y={970} label="Depo sorumlusu" glow={pulse(103.2)} shown={depot} />
        <RoleChip x={OFFICE.x + 375} y={850} label="Patron · ofis" glow={pulse(103.8)} shown={office} />
        <Highlight box={{ x: LEAD.x - 145, y: LEAD.y - 108, width: 310, height: 150 }} from={104.3} to={106.4} />
        <Highlight box={{ x: DEPOT.x - 168, y: DEPOT.y + 110, width: 324, height: 180 }} from={104.45} to={106.4} />
        <Highlight box={{ x: OFFICE.x + 345, y: OFFICE.y + 196, width: 380, height: 58 }} from={104.6} to={106.4} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: SANS, fontSize: 40,
        fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', opacity: progress(t, 104.2, 0.5) }}>
        Aynı çalışma alanı, <span style={{ color: brand.signature }}>herkes kendi rolünde.</span>
      </div>
    </AbsoluteFill>
  )
}
