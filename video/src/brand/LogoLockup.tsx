import { brand } from '../theme/colors'
import { SANS } from '../theme/fonts'
import { CraneMark } from './CraneMark'

/** Ürünün header'daki logosunun ölçüleri (MarketingLayout.vue): işaret 34 px, boşluk 10 px, yazı 16 px. */
export const HEADER_LOGO = { mark: 34, gap: 10, text: 16 }

type Props = {
  /** Header logosuna göre ölçek: 4 → ekranın ortasındaki büyük logo, 1 → header'daki logo. */
  scale: number
  surface: 'dark' | 'light'
  /** İşaretin çizilme ilerlemesi (0..1). */
  draw?: number
  /** Yazının soldan sağa açılması (0..1). */
  reveal?: number
}

const TEXT = {
  dark: { name: brand.onDeep, accent: brand.signature },
  light: { name: '#15213d', accent: brand.primary },
}

/**
 * "İskele ERP" logosu: vinç işareti + yazı, ürünün kendi diliyle (BrandMark/BrandLogo): "İskele" kalın, "ERP"
 * daha kalın ve vurgu renginde. Bütün ölçüler header logosunun katı: büyük logo header'a tek ölçekle iner.
 */
export const LogoLockup = ({ scale, surface, draw = 1, reveal = 1 }: Props) => {
  const colors = TEXT[surface]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: HEADER_LOGO.gap * scale, fontFamily: SANS }}>
      <CraneMark size={HEADER_LOGO.mark * scale} surface={surface} draw={draw} />
      <div style={{ clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% 0)`, fontSize: HEADER_LOGO.text * scale,
        fontWeight: 700, letterSpacing: '-0.035em', color: colors.name, whiteSpace: 'nowrap', lineHeight: 1 }}>
        İskele <b style={{ fontWeight: 800, color: colors.accent }}>ERP</b>
      </div>
    </div>
  )
}
