import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import { DESKTOP_STAGE } from '../../film/stage'
import { easeOutCubic, keyframes, progress } from '../../motion/ease'
import { AppWindow } from '../../ui/AppWindow'
import { Cursor } from '../../ui/Cursor'
import { cursorOn } from '../../ui/cursorPath'
import { FrameTrack } from '../../ui/FrameTrack'
import { Highlight } from '../../ui/Highlight'
import { Stage, cameraAt } from '../../ui/Stage'
import { Taps } from '../../ui/Taps'
import { BlueprintGrid } from '../brand/BlueprintGrid'
import { PhoneDevice } from '../chaos/closeup/PhoneDevice'
import { CAMERA, CURSOR, DESK_FRAMES, PHONE, PHONE_FRAMES, ROWS, TAPS } from './attendancePlan'

/** Telefon önce ortada, sonra sola kayar ve küçülür, en sonda kadrajdan çıkar. */
const phonePlacement = (t: number) => ({
  x: keyframes(t, [[55.0, PHONE.x], [55.7, 520], [57.5, 520], [58.2, -420]]),
  y: PHONE.y,
  scale: keyframes(t, [[55.0, PHONE.scale], [55.7, 0.82]]),
})

/** Ofisin bilgisayarı sağdan girer (yan yana: aynı kayıtlar), sonra tam ekrana büyür. */
const deskPlacement = (t: number) => ({
  x: keyframes(t, [[55.0, 2000], [55.7, 860], [57.5, 860], [58.2, DESKTOP_STAGE.x]]),
  y: keyframes(t, [[55.7, 300], [57.5, 300], [58.2, DESKTOP_STAGE.y]]),
  scale: keyframes(t, [[55.7, 0.66], [57.5, 0.66], [58.2, 1]]),
})

/**
 * Part 4 (50,6 – 62,5 sn): "Şef yoklamayı sahada alır. Ofis aylık puantajı aynı kayıtlardan görür.
 * Gerektiğinde Excel'e aktarır." Saha (telefon) → ofis (bilgisayar), aynı kayıtlar yan yana.
 */
export const AttendanceScene = () => {
  const t = useFilmTime()
  const phone = phonePlacement(t)
  const point = cursorOn(t, CURSOR.legs)
  const cursorShown = progress(t, 58.25, 0.2) * (1 - progress(t, 61.4, 0.2))
  return (
    <AbsoluteFill style={{ opacity: progress(t, 50.6, 0.5, easeOutCubic) }}>
      <BlueprintGrid drift={-t * 4} />
      <Stage shot={cameraAt(t, CAMERA)}>
        {t >= 54.9 && (
          <AppWindow placement={deskPlacement(t)}>
            <FrameTrack frames={DESK_FRAMES} />
          </AppWindow>
        )}
        {t < 58.3 && (
          <PhoneDevice x={phone.x} y={phone.y} scale={phone.scale}>
            <FrameTrack frames={PHONE_FRAMES} />
          </PhoneDevice>
        )}
        <Taps taps={TAPS} />
        {ROWS.map((row) => <Highlight key={row.from} {...row} />)}
        <Cursor x={point.x} y={point.y} clicks={CURSOR.clicks} opacity={cursorShown} />
      </Stage>
    </AbsoluteFill>
  )
}
