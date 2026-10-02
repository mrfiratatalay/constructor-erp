import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../film/clock'
import { brand } from '../theme/colors'
import { SANS } from '../theme/fonts'

/** Henüz üretilmemiş part'ların yeri: Studio'da zaman çizelgesi boş kalmasın, hangi saniyede olunduğu görünsün. */
export const ComingSoon = () => {
  const t = useFilmTime()
  return (
    <AbsoluteFill style={{ background: brand.night, color: 'rgb(255 255 255 / 0.5)', fontFamily: SANS,
      display: 'grid', placeItems: 'center', fontSize: 28 }}>
      Sonraki part · {t.toFixed(1)} sn
    </AbsoluteFill>
  )
}
