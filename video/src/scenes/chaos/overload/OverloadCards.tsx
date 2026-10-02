import type { ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../../film/clock'
import cues from '../../../film/cues/chaos.json'
import { easeOutCubic, progress } from '../../../motion/ease'
import { smoothNoise } from '../../../motion/random'
import { NotificationCard } from '../NotificationCard'
import { BadgeScrap, MissedCallScrap, NoteScrap, PhotoScrap, RosterScrap, SheetScrap, StickyScrap } from './Scraps'

type Slot = { x: number; y: number; angle: number; scale: number; from: [number, number]; content: ReactNode }

const note = (app: string, from: string, text: string, tone: string, icon = '💬') => (
  <NotificationCard app={app} from={from} text={text} tone={tone} icon={icon} />
)

/** Kartların yerleri elle seçildi: önce kenarlar, sonra merkez. Son kartlar patronun bakışının önüne düşer. */
const SLOTS: Slot[] = [
  { x: 1380, y: 120, angle: 4, scale: 0.95, from: [500, -200], content: note('Şantiye Grubu', 'Hakan', 'Pompa geldi, kim karşılayacak?', 'blue') },
  { x: 120, y: 90, angle: -6, scale: 0.95, from: [-500, -100], content: <SheetScrap /> },
  { x: 1440, y: 720, angle: -5, scale: 1, from: [500, 300], content: <MissedCallScrap /> },
  { x: 560, y: 70, angle: 5, scale: 0.92, from: [0, -400], content: <RosterScrap /> },
  { x: 90, y: 560, angle: 6, scale: 0.95, from: [-500, 100], content: note('Muhasebe', 'Selin', 'Hakediş tablosu hazır mı?', 'violet', '📊') },
  { x: 1520, y: 360, angle: 7, scale: 0.9, from: [500, 0], content: <PhotoScrap /> },
  { x: 980, y: 760, angle: 3, scale: 0.95, from: [200, 400], content: note('Mehmet · Depo', 'Mehmet', '8 panel iade geldi mi?', 'teal', '📦') },
  { x: 420, y: 680, angle: -7, scale: 0.95, from: [-300, 400], content: <NoteScrap /> },
  { x: 1000, y: 230, angle: -4, scale: 0.92, from: [300, -400], content: note('Demir Ekibi', 'Bayram Usta', 'Demir yetmedi, ne yapalım?', 'orange', '🔧') },
  { x: 380, y: 330, angle: -9, scale: 1, from: [-500, 0], content: <StickyScrap /> },
  { x: 700, y: 470, angle: 2, scale: 1, from: [0, 400], content: note('Muhasebe', 'Selin', 'Puantaj??', 'violet', '📊') },
  { x: 1100, y: 520, angle: -3, scale: 1.05, from: [400, 200], content: <BadgeScrap /> },
  { x: 560, y: 250, angle: 3, scale: 1.05, from: [-200, -400], content: note('Şantiye Grubu', 'Hakan', 'Beton döküm saati kaçtı?', 'blue') },
]

/** 11,15 – 13,3 sn: bilgi yığılır. Her kart bir yönden uçar, yerine oturur, sonra hafifçe salınır. */
export const OverloadCards = () => {
  const t = useFilmTime()
  return (
    <AbsoluteFill>
      {cues.overloadCards.map((at, index) => {
        const slot = SLOTS[index % SLOTS.length]
        const enter = progress(t, at, 0.42, easeOutCubic)
        if (enter <= 0) return null
        const sway = smoothNoise(index * 11, t * 0.8) * 6
        const x = slot.x + slot.from[0] * (1 - enter) + sway
        const y = slot.y + slot.from[1] * (1 - enter) + smoothNoise(index * 13, t * 0.7) * 5
        return (
          <div key={at} style={{ position: 'absolute', left: x, top: y, opacity: Math.min(1, enter * 1.6),
            transform: `rotate(${slot.angle * (0.6 + enter * 0.4)}deg) scale(${slot.scale})`, transformOrigin: '0 0' }}>
            {slot.content}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
