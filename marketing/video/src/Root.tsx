import { Composition } from 'remotion'
import { Ekip } from './ekip/Ekip'
import { DURATION as EKIP } from './ekip/timeline'
import { Ilerleme } from './ilerleme/Ilerleme'
import { DURATION as ILERLEME } from './ilerleme/timeline'
import { Malzeme } from './malzeme/Malzeme'
import { DURATION as MALZEME } from './malzeme/timeline'
import { Tanitim } from './tanitim/Tanitim'
import { DURATION as TANITIM } from './tanitim/timeline'
import { Saha } from './saha/Saha'
import { DURATION as SAHA } from './saha/timeline'
import { STAGE } from './theme'
import { Yoklama } from './yoklama/Yoklama'
import { DURATION as YOKLAMA } from './yoklama/timeline'

/** Serinin videoları. Her modül kendi klasöründe, kendi zamanlamasıyla; parça seti (kit/) ortaktır. */
const FORMAT = { fps: STAGE.fps, width: STAGE.width, height: STAGE.height }

export const Root: React.FC = () => (
  <>
    <Composition id="Yoklama" component={Yoklama} durationInFrames={YOKLAMA} {...FORMAT} />
    <Composition id="Malzeme" component={Malzeme} durationInFrames={MALZEME} {...FORMAT} />
    <Composition id="Ekip" component={Ekip} durationInFrames={EKIP} {...FORMAT} />
    <Composition id="Ilerleme" component={Ilerleme} durationInFrames={ILERLEME} {...FORMAT} />
    <Composition id="Saha" component={Saha} durationInFrames={SAHA} {...FORMAT} />
    <Composition id="Tanitim" component={Tanitim} durationInFrames={TANITIM} {...FORMAT} />
  </>
)
