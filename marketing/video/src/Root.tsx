import { Composition } from 'remotion'
import { STAGE } from './theme'
import { Yoklama } from './yoklama/Yoklama'
import { DURATION as YOKLAMA } from './yoklama/timeline'

/** Serinin videoları. Her modül kendi klasöründe, kendi zamanlamasıyla; parça seti (kit/) ortaktır. */
export const Root: React.FC = () => (
  <Composition id="Yoklama" component={Yoklama} durationInFrames={YOKLAMA} fps={STAGE.fps} width={STAGE.width} height={STAGE.height} />
)
