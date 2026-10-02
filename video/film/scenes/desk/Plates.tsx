// Ağır, durağan katmanların bir kez görüntüye çevrilmiş halleri (public/plates): pencere manzarası (bulanık) ve
// ön plandaki patron silueti. Her karede SVG bulanıklığı hesaplamak yerine hazır görüntü kullanılır.
import { AbsoluteFill } from 'remotion'
import { SiteWindow } from './SiteWindow'

export const WindowPlate: React.FC<{ calm?: boolean }> = ({ calm = false }) => (
  <AbsoluteFill><SiteWindow calm={calm} viewBox="0 300 1920 711" width={1620} height={600} /></AbsoluteFill>
)

export const PatronPlate: React.FC<{ calm?: boolean }> = ({ calm = false }) => (
  <AbsoluteFill style={{ background: 'transparent' }}>
    <svg viewBox="0 0 800 1080" width={800} height={1080} style={{ filter: 'blur(7px)' }}>
      <path d="M120 1080 C120 850 200 760 330 730 C300 690 280 640 282 585 C284 470 360 410 440 410 C530 410 600 480 596 590
        C594 650 570 700 530 730 C660 760 760 860 790 1080 Z" fill={calm ? '#0d121c' : '#0a0e16'} />
      <path d="M440 410 C520 410 590 470 596 560" stroke="rgba(255,214,160,0.35)" strokeWidth={6} fill="none" />
    </svg>
  </AbsoluteFill>
)
