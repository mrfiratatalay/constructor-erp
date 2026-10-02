import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../film/clock'
import { DESKTOP_STAGE } from '../film/stage'
import { easeOutCubic, progress } from '../motion/ease'
import { BlueprintGrid } from '../scenes/brand/BlueprintGrid'
import { PhoneDevice } from '../scenes/chaos/closeup/PhoneDevice'
import { AppWindow } from './AppWindow'
import type { PhonePlacement } from './coords'
import { Cursor } from './Cursor'
import { cursorOn, type Leg } from './cursorPath'
import { FrameTrack, type FrameCue } from './FrameTrack'
import { Highlight } from './Highlight'
import { Stage, cameraAt, type Shot } from './Stage'
import { Taps, type Tap } from './Taps'
import type { Box } from './useCapture'

/** Bir ürün sahnesinin bütün planı: hangi kare ne zaman, kamera nereye, imleç ve vurgular. Kod değil, veri. */
export type UiPlan = {
  from: number
  to: number
  frames: FrameCue[]
  camera: Array<[number, Shot]>
  /** Varsa sahne telefonda oynar; yoksa masaüstü penceresinde. */
  phone?: PhonePlacement
  cursor?: { legs: Leg[]; clicks: number[]; visible: Array<[number, number]> }
  taps?: Tap[]
  highlights?: Array<{ box: Box; from: number; to: number }>
  /** Önceki sahnenin üstüne çapraz geçiş süresi. */
  enter?: number
}

const visibility = (t: number, windows: Array<[number, number]>): number =>
  Math.max(0, ...windows.map(([from, to]) => progress(t, from, 0.2) * (1 - progress(t, to - 0.2, 0.2))))

const Device = ({ plan }: { plan: UiPlan }) =>
  plan.phone ? (
    <PhoneDevice x={plan.phone.x} y={plan.phone.y} scale={plan.phone.scale}>
      <FrameTrack frames={plan.frames} />
    </PhoneDevice>
  ) : (
    <AppWindow placement={DESKTOP_STAGE}>
      <FrameTrack frames={plan.frames} />
    </AppWindow>
  )

/**
 * Gerçek ürün çekimlerini sahneye koyar: blueprint zemin, kamera, cihaz, vurgular, imleç ya da dokunuşlar.
 * Bütün ürün part'ları bu tek bileşenle oynar; farkları yalnızca planlarındadır.
 */
export const UiScene = ({ plan }: { plan: UiPlan }) => {
  const t = useFilmTime()
  const shown = plan.enter ? progress(t, plan.from, plan.enter, easeOutCubic) : 1
  const point = plan.cursor ? cursorOn(t, plan.cursor.legs) : null
  return (
    <AbsoluteFill style={{ opacity: shown, transform: `scale(${0.985 + shown * 0.015})` }}>
      <BlueprintGrid drift={-t * 4} />
      <Stage shot={cameraAt(t, plan.camera)}>
        <Device plan={plan} />
        {plan.highlights?.map((item) => <Highlight key={`${item.from}-${item.box.x}`} {...item} />)}
        {plan.taps && <Taps taps={plan.taps} />}
        {plan.cursor && point && (
          <Cursor x={point.x} y={point.y} clicks={plan.cursor.clicks} opacity={visibility(t, plan.cursor.visible)} />
        )}
      </Stage>
    </AbsoluteFill>
  )
}
