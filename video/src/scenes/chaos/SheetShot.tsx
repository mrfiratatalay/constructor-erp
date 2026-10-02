import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { HAND } from '../../theme/fonts'
import { keyframes } from '../../motion/ease'
import { CELL, PEOPLE, Spreadsheet, markAt } from './closeup/Spreadsheet'

const [START, END] = cues.shots.sheet
/** Klavye sesleriyle aynı anda seçim hücreden hücreye atlar: (saniye, satır, gün). */
const HOPS: Array<[number, number, number]> = [[START, 0, 3], [6.62, 0, 4], [6.8, 1, 4], [6.96, 2, 4], [7.08, 2, 5]]

const Selection = () => {
  const t = useFilmTime()
  const [, row, day] = [...HOPS].reverse().find(([at]) => t >= at) ?? HOPS[0]
  return (
    <div style={{ position: 'absolute', left: CELL.nameWidth + day * CELL.width - 1,
      top: CELL.top + row * CELL.height - 1, width: CELL.width + 2, height: CELL.height + 2,
      border: '3px solid #2563eb', boxShadow: '0 0 0 2px rgb(37 99 235 / 0.25)' }} />
  )
}

const formulaFor = (t: number): string => {
  const [, row, day] = [...HOPS].reverse().find(([at]) => t >= at) ?? HOPS[0]
  return `${PEOPLE[row]} · ${day + 1} Eylül → "${markAt(row, day)}"   (yarım gün mü??)`
}

/** Ekrana yapıştırılmış not: bilgi bir de laptopun çerçevesinde. */
const StickyNote = () => (
  <div style={{ position: 'absolute', left: 1500, top: 64, width: 250, height: 210, background: '#fde68a',
    transform: 'rotate(6deg)', boxShadow: '0 14px 26px rgb(0 0 0 / 0.35)', padding: '22px 22px', fontFamily: HAND,
    fontSize: 38, lineHeight: 1.05, color: '#3f3a2a' }}>
    Ali yarım gün?<br />Cuma avans!!
  </div>
)

/** 6,4 – 7,15 sn, "Yoklama başka yerde" (1): laptopta elle tutulan puantaj tablosu, ekranda yapışkan not. */
export const SheetShot = () => {
  const t = useFilmTime()
  const scale = keyframes(t, [[START, 1.0], [END, 1.05]])
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(90% 80% at 80% 10%, #6b5a4a, #1a1512 70%)' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: '40% 50%' }}>
        <div style={{ position: 'absolute', left: 90, top: 70, width: 1560, height: 1000, borderRadius: 26,
          background: '#14171e', boxShadow: '0 40px 90px rgb(0 0 0 / 0.6)',
          transform: 'perspective(2400px) rotateY(-7deg) rotateX(3deg)' }}>
          <div style={{ position: 'absolute', inset: 22, borderRadius: 6, overflow: 'hidden' }}>
            <Spreadsheet file="puantaj_eylul_SON_v3 (2).xlsx" formula={formulaFor(t)} />
            <Selection />
          </div>
        </div>
        <StickyNote />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
