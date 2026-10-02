import { Composition } from 'remotion'
import { Film } from './Film'
import { FPS, HEIGHT, WIDTH, sec, FILM_SECONDS } from './film/clock'
import { loadFilmFonts } from './theme/fonts'

loadFilmFonts()

export const Root = () => (
  <Composition id="Film" component={Film} durationInFrames={sec(FILM_SECONDS)} fps={FPS} width={WIDTH}
    height={HEIGHT} />
)
