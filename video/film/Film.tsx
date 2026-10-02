// Filmin tamamı: bölümler zaman çizelgesine dizilir. Ses ayrı üretilir ve ffmpeg ile birleştirilir (audio/master.py).
import { AbsoluteFill, Sequence } from 'remotion'
import { CheckMorph } from './components/CheckMorph'
import { BrandScene } from './scenes/brand/BrandScene'
import { ChaosScene } from './scenes/chaos/ChaosScene'
import { Closing } from './sections/Closing'
import { Devices } from './sections/Devices'
import { Materials, Puantaj } from './sections/Office'
import { Admin, Apply, Landing, Setup } from './sections/Onboarding'
import { Production, Tasks } from './sections/Progress'
import { RollCall } from './sections/RollCall'
import { Sites } from './sections/Sites'
import { sec } from './theme'
import { SECTIONS, type SectionName } from './timeline'

const PARTS: [SectionName, React.FC][] = [
  ['chaos', ChaosScene], ['brand', BrandScene], ['landing', Landing], ['apply', Apply], ['admin', Admin], ['setup', Setup],
  ['sites', Sites], ['rollcall', RollCall], ['puantaj', Puantaj], ['materials', Materials], ['production', Production],
  ['tasks', Tasks], ['devices', Devices], ['closing', Closing],
]

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {PARTS.map(([name, Part]) => {
      const [start, end] = SECTIONS[name]
      return (
        <Sequence key={name} name={name} from={sec(start)} durationInFrames={sec(end - start)}>
          <Part />
        </Sequence>
      )
    })}
    <Sequence name="check" from={sec(SECTIONS.tasks[1] - 0.6)} durationInFrames={sec(1.4)}><CheckMorph /></Sequence>
  </AbsoluteFill>
)
