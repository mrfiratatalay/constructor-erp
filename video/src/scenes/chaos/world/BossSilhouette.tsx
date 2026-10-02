import { useFilmTime } from '../../../film/clock'
import { keyframes } from '../../../motion/ease'

const BODY =
  'M-90 1080 L-80 880 C-60 820 40 790 120 776 C160 770 196 760 214 742 L286 742 C300 762 340 774 392 790 ' +
  'C470 814 530 870 560 960 L590 1080Z'
const HEAD = 'M250 742 C150 750 92 680 90 598 C88 500 150 438 236 436 C322 434 376 500 372 596 C368 680 330 736 250 742Z'

/**
 * Patron: omuz üstü, sırtı kameraya dönük, odak dışında. Yüz yok; odak onun karşısındaki bilgi karmaşasında.
 * Pencereden gelen ışık başının ve omzunun kenarını sıcak bir çizgiyle ayırır. Kaos arttıkça başı hafifçe eğilir.
 */
export const BossSilhouette = ({ calm = false }: { calm?: boolean }) => {
  const t = useFilmTime()
  const breath = Math.sin(t * 1.6) * 2.2
  const tilt = calm ? 0 : keyframes(t, [[11.4, 0], [13.2, 4.5]])
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="boss-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#05070c" />
          <stop offset="0.8" stopColor="#0b0e16" />
          <stop offset="1" stopColor="#141824" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${breath})`}>
        <path d={BODY} fill="url(#boss-fill)" />
        <path d="M392 790 C470 814 530 870 560 960" stroke="#ffcf8a" strokeWidth={9} fill="none" opacity={0.5} />
        <g transform={`rotate(${tilt} 250 742)`}>
          <path d={HEAD} fill="url(#boss-fill)" />
          <path d="M236 436 C322 434 376 500 372 596 C368 680 330 736 250 742" stroke="#ffcf8a" strokeWidth={11}
            fill="none" opacity={0.62} />
          <path d="M368 586 C384 590 388 626 370 640" stroke="#ffcf8a" strokeWidth={3} fill="#0b0e16" opacity={0.6} />
        </g>
      </g>
    </svg>
  )
}
