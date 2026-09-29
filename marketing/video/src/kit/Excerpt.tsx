import type { ReactNode } from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress } from './motion'
import { MusicOff } from './Soundtrack'

type ExcerptProps = { from: number; source: number; length: number; children: ReactNode }

/**
 * Bir modül videosunun bir parçası, ana videonun içinde: ana videonun from karesinde, kaynağın source karesinden
 * başlar, length kare sürer. Parçanın müziği susar (altında ana videonun müziği çalar), efektleri çalar. Kesme sert
 * durmasın diye parça koyu laciverdin içinden açılır.
 */
export const Excerpt: React.FC<ExcerptProps> = ({ from, source, length, children }) => (
  <Sequence from={from} durationInFrames={length}>
    <Sequence from={-source}>
      <MusicOff.Provider value>{children}</MusicOff.Provider>
    </Sequence>
    <OpeningShade />
  </Sequence>
)

const OpeningShade: React.FC = () => {
  const frame = useCurrentFrame()
  const shade = 1 - progress(frame, 0, 8)
  if (shade <= 0) return null
  return <AbsoluteFill style={{ background: COLOR.deep, opacity: shade }} />
}
