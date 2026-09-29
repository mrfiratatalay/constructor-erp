import { AbsoluteFill } from 'remotion'
import { Ekip } from '../ekip/Ekip'
import { Ilerleme } from '../ilerleme/Ilerleme'
import { Blueprint } from '../kit/Blueprint'
import { ChapterTag } from '../kit/ChapterTag'
import { EndCard } from '../kit/EndCard'
import { Excerpt } from '../kit/Excerpt'
import { Soundtrack } from '../kit/Soundtrack'
import { Title } from '../kit/Title'
import { useBrandFont } from '../kit/useBrandFont'
import { Malzeme } from '../malzeme/Malzeme'
import { Saha } from '../saha/Saha'
import { COLOR, FONT } from '../theme'
import { Yoklama } from '../yoklama/Yoklama'
import { CHAPTER_LENGTH, CHAPTERS, CLOSING, CUES, END_CARD, FINALE, INTRO, MUSIC } from './timeline'

const FILMS: Record<string, React.FC> = { Yoklama, Malzeme, Saha, İlerleme: Ilerleme, Ekip }

/**
 * Ana video: Kızılkan Yapı'ya sunulan 72 saniyelik tanıtım. Beş modül videosundan birer parça, her biri kendi
 * sözleri ve efektleriyle; altında tek bir müzik. Sonda beş işin tek uygulamada olduğu söylenir.
 */
export const Tanitim: React.FC = () => {
  useBrandFont()
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: COLOR.deep, overflow: 'hidden' }}>
      <Blueprint />
      {INTRO.map((title) => (
        <Title key={title.from} {...title} />
      ))}
      {CHAPTERS.map((chapter, index) => {
        const Film = FILMS[chapter.name]
        const frames = { from: chapter.from, to: chapter.from + CHAPTER_LENGTH }
        return (
          <AbsoluteFill key={chapter.name}>
            <Excerpt from={chapter.from} source={chapter.source} length={CHAPTER_LENGTH}>
              <Film />
            </Excerpt>
            <ChapterTag index={index + 1} count={CHAPTERS.length} name={chapter.name} frames={frames} />
          </AbsoluteFill>
        )
      })}
      <Title {...FINALE} size={84} />
      <EndCard start={END_CARD} line={CLOSING.line} note={CLOSING.note} />
      <Soundtrack music={MUSIC.name} musicVolume={MUSIC.volume} cues={CUES} />
    </AbsoluteFill>
  )
}
