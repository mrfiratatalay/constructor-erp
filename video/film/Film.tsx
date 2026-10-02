// Filmin tamamı: bölümler zaman çizelgesine dizilir. Ses ayrı üretilir ve ffmpeg ile birleştirilir (audio/mix.mjs).
import { AbsoluteFill, Sequence } from 'remotion'
import { BrandScene } from './scenes/brand/BrandScene'
import { ChaosScene } from './scenes/chaos/ChaosScene'
import { Admin, Apply, Landing, Setup } from './sections/Onboarding'
import { RollCall } from './sections/RollCall'
import { Sites } from './sections/Sites'
import { sec } from './theme'
import { SECTIONS, type SectionName } from './timeline'

const PARTS: [SectionName, React.FC][] = [
  ['chaos', ChaosScene], ['brand', BrandScene], ['landing', Landing], ['apply', Apply], ['admin', Admin], ['setup', Setup],
  ['sites', Sites], ['rollcall', RollCall],
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
  </AbsoluteFill>
)
