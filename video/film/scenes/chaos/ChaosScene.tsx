// 00:00–00:15 · KAOS. Masa, telefon, tablo, kâğıtlar; mesajlar, aramalar, fotoğraflar üst üste biner. 12,1 sn'de her
// şey donar ("Ve sonunda herkes aynı soruyu sorar"), kamera sessizce yaklaşır; bölüm sonunda kesme (siyah).
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion'
import { Camera } from '../../components/Camera'
import { DeskSet } from '../desk/DeskSet'
import { DeliveryNote, Pencil, RollCallPaper, StickyNote } from '../desk/Papers'
import { CoffeeCup, Dust, HardHat, Patron } from '../desk/Sprites'
import { Badge, CallCard, type CardSpec, MessageCard } from './Cards'
import { PhoneLock, Spreadsheet } from './Screens'

export const FREEZE = 12.1

const CARDS: CardSpec[] = [
  { at: 2.6, x: 1330, y: 110, author: 'Ayşe Kara', text: 'Kemal Bey, beton saat kaçta?' },
  { at: 3.2, x: 1240, y: 280, author: 'Ali Usta', text: 'Demirciler bugün gelmedi.', rotate: -2 },
  { at: 5.3, x: 130, y: 120, author: 'Musa Aydın', photo: 'photos/santiye-yomra-sm.jpg' },
  { at: 6.0, x: 470, y: 70, author: 'Ayşe Kara', voice: '0:42', rotate: 1.5 },
  { at: 8.4, x: 1210, y: 520, author: 'Mehmet Şahin', group: 'Depo · Mehmet', text: '24 panel çıktı.', rotate: 1 },
  { at: 9.2, x: 110, y: 560, author: 'Muhasebe', group: 'Ofis', text: 'Puantajı ne zaman göndereceksiniz?', rotate: -1.5 },
  { at: 10.05, x: 690, y: 150, author: 'Ayşe Kara', photo: 'photos/kolon-kaliplari-sm.jpg', text: '2. kat kolonlar tamam' },
  { at: 10.55, x: 760, y: 330, author: 'Burak Yıldız', group: 'Kaşüstü Grubu', text: 'Kaşüstü’ne de pompa lazım', rotate: -2 },
  { at: 10.85, x: 600, y: 470, author: 'Mehmet Şahin', group: 'Depo · Mehmet', text: 'Çimento geldi mi?', rotate: 2 },
]

const FLOOD = ['Neredesiniz?', 'Fatura geldi mi?', 'Yarın kim geliyor?', 'Kalıp eksik!', 'Vinç arızalı', 'Pompa ne oldu?',
  '📷 Fotoğraf', '🎤 Sesli mesaj', 'Beni arar mısın?', 'Puantaj?', 'Demir kaç ton?', 'İskele ne zaman?']
const FLOOD_CARDS: CardSpec[] = FLOOD.map((text, i) => ({
  at: 11.0 + i * 0.085, x: 80 + random(`fx${i}`) * 1440, y: 40 + random(`fy${i}`) * 820, rotate: (random(`fr${i}`) - 0.5) * 8,
  author: ['Ayşe Kara', 'Mehmet Şahin', 'Burak Yıldız', 'Ali Usta', 'Muhasebe'][i % 5], text,
}))

const glowAt = (t: number, start: number) => interpolate(t, [start - 0.1, start + 0.3, start + 1.4, start + 1.8], [0, 1, 1, 0],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

export const ChaosScene: React.FC = () => {
  const t = useCurrentFrame() / 30
  const tf = Math.min(t, FREEZE)
  const frozen = interpolate(t, [FREEZE, FREEZE + 0.25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const buzz = [1.8, 2.6, 3.2, 5.3, 8.4, 10.05, 11.2].some((at) => tf >= at && tf < at + 0.45) ? 1 : 0
  const overload = interpolate(tf, [10.8, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const jitter = overload * (1 - frozen) * 3
  return (
    <AbsoluteFill style={{ background: '#000', opacity: interpolate(t, [0.5, 1.5], [0, 1], { extrapolateRight: 'clamp' }),
      filter: `saturate(${1 - frozen * 0.55}) brightness(${1 - frozen * 0.22})` }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${Math.sin(t * 40) * jitter}px, ${Math.cos(t * 37) * jitter}px)` }}>
        <Camera keys={{ scale: [[0, 1.05], [6.4, 1.07], [7.0, 1.36], [8.1, 1.36], [8.6, 1.34], [9.8, 1.34], [10.3, 1.08], [FREEZE, 1.1], [14.85, 1.24]],
          x: [[0, 0], [6.4, 0], [7.0, 285], [8.1, 285], [8.6, -310], [9.8, -310], [10.3, 0]],
          y: [[0, 0], [6.4, 0], [7.0, -175], [8.1, -175], [8.6, -95], [9.8, -95], [10.3, 0], [FREEZE, 0], [14.85, -30]] }}>
          <DeskSet laptop={<Spreadsheet time={tf} flicker={overload} />} phone={<PhoneLock time={tf} />} buzz={buzz * (1 - frozen)}
            papers={<><RollCallPaper glow={glowAt(tf, 6.7)} /><DeliveryNote glow={glowAt(tf, 8.35)} /><StickyNote /><Pencil /></>} />
          <HardHat x={300} y={640} scale={0.78} />
          <CoffeeCup x={1650} y={500} />
          <Dust />
          <Badge count={Math.round(interpolate(tf, [1.8, 12], [1, 47], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))} x={1720} y={700} />
        </Camera>
        <Patron shift={interpolate(t, [0, 14.85], [0, -40])} />
        {[...CARDS, ...FLOOD_CARDS].map((spec, i) => <MessageCard key={i} spec={spec} time={tf} tone={i} width={spec.photo ? 330 : 380} />)}
        <CallCard at={4.9} time={tf < 6.6 ? tf : -1} x={1400} y={430} who="Ayşe Kara" role="Şantiye Şefi" />
        <CallCard at={11.35} time={tf} x={760} y={600} who="Cevapsız arama (3)" role="Ayşe Kara · Şantiye Şefi" />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  )
}
