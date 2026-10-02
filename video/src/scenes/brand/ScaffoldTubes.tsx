import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { brand } from '../../theme/colors'
import { progress } from '../../motion/ease'
import { BRACES, FRAME, LEDGERS, MODULE, STANDARDS, moduleBox } from './scaffold'

const OVERHANG = 30

type Line = { x1: number; y1: number; x2: number; y2: number; at: number; width?: number }

/** Çizim sırası iskele kurma sırasıdır: önce dikmeler (aşağıdan yukarı), sonra yatay borular, en son çaprazlar. */
const lines = (): Line[] => {
  const [start, end] = cues.scaffoldDraw
  const span = end - start
  const bottom = FRAME.top + FRAME.height + OVERHANG
  const top = FRAME.top - OVERHANG
  const standards = STANDARDS.map((x, index) => ({
    x1: x, y1: bottom, x2: x, y2: top, at: start + Math.abs(index - 2) * span * 0.12, width: 3,
  }))
  const ledgers = LEDGERS.map((y, index) => ({
    x1: STANDARDS[0] - OVERHANG, y1: y, x2: STANDARDS[MODULE.columns] + OVERHANG, y2: y,
    at: start + span * (0.3 + (LEDGERS.length - 1 - index) * 0.08),
  }))
  const braces = BRACES.map((cell, index) => {
    const box = moduleBox(cell)
    return { x1: box.x - 11, y1: box.y + box.height + 11, x2: box.x + box.width + 11, y2: box.y - 11, at: start + span * (0.62 + index * 0.06) }
  })
  return [...standards, ...ledgers, ...braces]
}

/** İlk çizgi: kaosun ardından ekranın tam ortasında, aşağıdan yukarı tek bir temiz dikey çizgi. */
const FirstLine = ({ t }: { t: number }) => {
  const drawn = progress(t, cues.firstLine[0], cues.firstLine[1] - cues.firstLine[0])
  const bottom = FRAME.top + FRAME.height + OVERHANG
  return (
    <line x1={960} y1={bottom} x2={960} y2={bottom - (bottom - FRAME.top + OVERHANG) * drawn} stroke={brand.signature}
      strokeWidth={3} strokeLinecap="round" />
  )
}

/** İskele boruları: baret sarısı, ince, teknik çizim gibi. Landing'e dönüşürken solup kaybolur. */
export const ScaffoldTubes = ({ opacity }: { opacity: number }) => {
  const t = useFilmTime()
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', opacity }}>
      <FirstLine t={t} />
      {lines().map((line) => {
        const drawn = progress(t, line.at, 0.32)
        if (drawn <= 0) return null
        return (
          <line key={`${line.x1}-${line.y1}-${line.x2}`} x1={line.x1} y1={line.y1}
            x2={line.x1 + (line.x2 - line.x1) * drawn} y2={line.y1 + (line.y2 - line.y1) * drawn}
            stroke={brand.signature} strokeWidth={line.width ?? 2} strokeLinecap="round" opacity={line.width ? 0.95 : 0.7} />
        )
      })}
      {STANDARDS.map((x) => {
        const plate = progress(t, cues.scaffoldDraw[0], 0.3)
        return <rect key={x} x={x - 14} y={FRAME.top + FRAME.height + OVERHANG - 2} width={28} height={5}
          fill={brand.signature} opacity={plate * 0.9} />
      })}
    </svg>
  )
}
