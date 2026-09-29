import { createContext, useContext } from 'react'
import { Audio, Sequence, staticFile } from 'remotion'

/** Bir ses işareti: hangi karede, hangi efekt (public/audio/sfx/<ad>.wav), ne yükseklikte. */
export type Cue = { at: number; sound: string; volume: number }

/**
 * Ana video modül videolarından parçalar oynatır; parçaların altında kendi müzikleri değil, ana videonun tek müziği
 * çalar. Bu bağlam açıkken Soundtrack müziği atlar, efektleri çalmaya devam eder.
 */
export const MusicOff = createContext(false)

/**
 * Videonun sesi: altta müzik, üstünde her hareketin efekti kendi karesinde. Sesler audio/ klasöründe kodla üretilir
 * (npm run audio); efektler kısa olduğu için her biri çalıp biter, süre vermek gerekmez.
 */
export const Soundtrack: React.FC<{ music: string; musicVolume: number; cues: Cue[] }> = ({ music, musicVolume, cues }) => {
  const musicOff = useContext(MusicOff)
  return (
    <>
      {!musicOff && <Audio src={staticFile(`audio/${music}.wav`)} volume={musicVolume} />}
      {cues.map((cue, index) => (
        <Sequence key={`${cue.sound}-${index}`} from={cue.at} layout="none">
          <Audio src={staticFile(`audio/sfx/${cue.sound}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  )
}
