// Kompozisyonlar: Film (120 sn, 1920×1080, 30 kare/sn) ve tek tek sahneler (geliştirirken önizleme için).
import { Composition } from 'remotion'
import { Film } from './Film'
import { loadFonts } from './fonts'
import { SCENES } from './scenes'
import { FPS, sec } from './theme'

loadFonts()

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={sec(120)} fps={FPS} width={1920} height={1080} />
    {SCENES.map(({ id, component, seconds }) => (
      <Composition key={id} id={id} component={component} durationInFrames={sec(seconds)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
)
