import { Audio, Sequence, staticFile } from 'remotion'

/** Bir ses işareti: hangi karede, hangi efekt (public/audio/sfx/<ad>.wav), ne yükseklikte. */
export type Cue = { at: number; sound: string; volume: number }

/**
 * Videonun sesi: altta müzik, üstünde her hareketin efekti kendi karesinde. Sesler audio/ klasöründe kodla üretilir
 * (npm run audio); efektler kısa olduğu için her biri çalıp biter, süre vermek gerekmez.
 */
export const Soundtrack: React.FC<{ music: string; musicVolume: number; cues: Cue[] }> = ({ music, musicVolume, cues }) => (
  <>
    <Audio src={staticFile(`audio/${music}.wav`)} volume={musicVolume} />
    {cues.map((cue, index) => (
      <Sequence key={`${cue.sound}-${index}`} from={cue.at} layout="none">
        <Audio src={staticFile(`audio/sfx/${cue.sound}.wav`)} volume={cue.volume} />
      </Sequence>
    ))}
  </>
)
