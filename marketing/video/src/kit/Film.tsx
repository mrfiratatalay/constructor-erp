import type { ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'
import { COLOR, FONT } from '../theme'
import { Blueprint } from './Blueprint'
import { Camera } from './Camera'
import { Captions, type Line } from './Captions'
import { EndCard } from './EndCard'
import type { Pose } from './motion'
import { Soundtrack, type Cue } from './Soundtrack'
import { Title } from './Title'
import { useBrandFont } from './useBrandFont'

/** Bir videonun metni ve sesi: açılış soruları, sözler, kapanış, müzik ve efektler. */
export type FilmScript = {
  intro: { text: string; from: number; to: number }[]
  captions: Line[]
  closing: { start: number; line: string; note: string }
  music: { name: string; volume: number }
  cues: Cue[]
}

/**
 * Serinin her videosunun iskeleti: teknik çizim zemini, kameranın içinde cihazlar (world), kameranın dışında ekranın
 * üstünde duranlar (overlay: uçan dosya gibi), sözler, açılış soruları, kapanış kartı ve ses. Videolar yalnızca
 * dünyalarını ve metinlerini verir; görünüş ve ses dili hepsinde aynıdır.
 */
export const Film: React.FC<{ camera: Pose[]; script: FilmScript; world: ReactNode; overlay?: ReactNode }> = ({
  camera,
  script,
  world,
  overlay,
}) => {
  useBrandFont()
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: COLOR.deep, overflow: 'hidden' }}>
      <Blueprint />
      <Camera poses={camera}>{world}</Camera>
      {overlay}
      <Captions lines={script.captions} />
      {script.intro.map((title) => (
        <Title key={title.from} {...title} />
      ))}
      <EndCard start={script.closing.start} line={script.closing.line} note={script.closing.note} />
      <Soundtrack music={script.music.name} musicVolume={script.music.volume} cues={script.cues} />
    </AbsoluteFill>
  )
}
