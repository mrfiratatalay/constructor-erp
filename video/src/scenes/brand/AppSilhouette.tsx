import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { DESKTOP_STAGE } from '../../film/stage'
import { progress } from '../../motion/ease'
import { TITLE_BAR, VIEWPORT } from '../../ui/AppWindow'

/** İskeleden doğan pencerenin dış çizgisi: modüller içeriye yerleşirken çerçeve kendini çizer. */
export const AppSilhouette = ({ opacity }: { opacity: number }) => {
  const t = useFilmTime()
  const drawn = progress(t, cues.appSilhouette[0], cues.appSilhouette[1] - cues.appSilhouette[0])
  const { x, y, scale } = DESKTOP_STAGE
  const top = y - TITLE_BAR * scale
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', opacity }}>
      <rect x={x} y={top} width={VIEWPORT.width * scale} height={(VIEWPORT.height + TITLE_BAR) * scale} rx={14}
        fill="none" stroke="rgb(255 255 255 / 0.4)" strokeWidth={1.5} pathLength={1} strokeDasharray={1}
        strokeDashoffset={1 - drawn} />
      <line x1={x} x2={x + VIEWPORT.width * scale * drawn} y1={y} y2={y} stroke="rgb(255 255 255 / 0.25)" strokeWidth={1} />
    </svg>
  )
}
