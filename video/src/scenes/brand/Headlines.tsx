import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { brand } from '../../theme/colors'
import { SANS } from '../../theme/fonts'
import { easeInCubic, easeOutCubic, progress } from '../../motion/ease'

const BASELINE = 790

type Line = { in: number; out: number }

/** Girişte aşağıdan yükselip netleşir, çıkışta hafifçe küçülerek kaybolur (spesifikasyon: "metin küçülür"). */
const motionOf = (t: number, line: Line) => {
  const enter = progress(t, line.in, 0.55, easeOutCubic)
  const leave = progress(t, line.out, 0.35, easeInCubic)
  return { opacity: enter * (1 - leave), y: (1 - enter) * 26 - leave * 10, scale: 1 - leave * 0.12, blur: (1 - enter) * 8 }
}

/**
 * İki cümle, ekranın alt üçte birinde, ürünün yazı tipiyle. İkinci cümle tanıtım sitesinin başlığı gibi iki
 * renkli: beyaz + baret sarısı ("Saha hareketli. / Kontrol sizde." ile aynı dil).
 */
export const Headlines = () => {
  const t = useFilmTime()
  const first = motionOf(t, cues.headlineOne)
  const second = motionOf(t, cues.headlineTwo)
  const common = { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: SANS } as const
  return (
    <AbsoluteFill>
      <div style={{ ...common, top: BASELINE - 40, fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em',
        color: 'rgb(255 255 255 / 0.86)', opacity: first.opacity, filter: `blur(${first.blur}px)`,
        transform: `translateY(${first.y}px) scale(${first.scale})` }}>
        {cues.headlineOne.text}
      </div>
      <div style={{ ...common, top: BASELINE - 52, fontSize: 74, fontWeight: 800, letterSpacing: '-0.045em',
        color: '#fff', opacity: second.opacity, filter: `blur(${second.blur}px)`,
        transform: `translateY(${second.y}px) scale(${second.scale})` }}>
        Yönetimi olmak <span style={{ color: brand.signature }}>zorunda değil.</span>
      </div>
    </AbsoluteFill>
  )
}
