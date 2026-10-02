import { useFilmTime } from '../../../film/clock'

/** Baret: markanın sarısı sahneye ilk kez gerçek bir nesne olarak girer. Arkadan ışık, üst kenarda parlama. */
const HardHat = () => (
  <g>
    <defs>
      <linearGradient id="hat-body" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#ffe189" />
        <stop offset="0.18" stopColor="#f2bd16" />
        <stop offset="0.7" stopColor="#b9890c" />
        <stop offset="1" stopColor="#7d5d0a" />
      </linearGradient>
    </defs>
    <ellipse cx={1662} cy={772} rx={150} ry={20} fill="#000" opacity={0.45} />
    <ellipse cx={1660} cy={764} rx={132} ry={17} fill="#9c740c" />
    <path d="M1548 762 C1548 690 1594 652 1660 650 C1726 652 1772 690 1772 762Z" fill="url(#hat-body)" />
    <path d="M1648 652 C1650 690 1652 730 1652 762 L1668 762 C1668 730 1670 690 1672 652Z" fill="#ffd34d" opacity={0.55} />
    <path d="M1556 724 C1570 680 1610 655 1660 652" stroke="#fff3c4" strokeWidth={2.5} fill="none" opacity={0.8} />
  </g>
)

/** Kahve: buğusu ince, yavaş, dağılan çizgiler. */
const Mug = () => {
  const t = useFilmTime()
  return (
    <g>
      <ellipse cx={436} cy={790} rx={52} ry={9} fill="#000" opacity={0.4} />
      <path d="M398 702 L398 782 C398 792 474 792 474 782 L474 702Z" fill="#7d828c" />
      <path d="M466 702 L466 784 L474 782 L474 702Z" fill="#c9ccd3" opacity={0.7} />
      <path d="M398 718 C372 718 372 760 398 760" stroke="#6b707a" strokeWidth={8} fill="none" />
      <ellipse cx={436} cy={702} rx={38} ry={7} fill="#3b2a20" stroke="#a7abb3" strokeWidth={2} />
      <g fill="none" stroke="#e8e1d6" strokeWidth={3} strokeLinecap="round" style={{ filter: 'blur(2.5px)' }}>
        {[0, 1, 2].map((index) => {
          const drift = Math.sin(t * 1.1 + index * 2) * 8
          const rise = ((t * 18 + index * 30) % 90)
          return (
            <path key={index} opacity={0.22 * (1 - rise / 90)}
              d={`M${426 + index * 10} ${694 - rise} c${drift} -16 ${-drift} -30 ${drift / 2} -46`} />
          )
        })}
      </g>
    </g>
  )
}

/** Plan rulosu: önde, alan derinliğinin dışında kalan açık mavi silindir. */
const Blueprints = () => (
  <g transform="rotate(-9 1700 930)">
    <rect x={1500} y={900} width={440} height={60} rx={30} fill="#5f7698" />
    <rect x={1500} y={900} width={440} height={13} rx={6} fill="#a9bfdf" opacity={0.55} />
    <ellipse cx={1504} cy={930} rx={17} ry={30} fill="#8fa8cc" />
    <path d="M1504 913 a10 17 0 1 1 -1 34 a6 10 0 1 1 1 -20" stroke="#56709a" strokeWidth={2} fill="none" />
  </g>
)

/** Kâğıt yığını: irsaliyeler, notlar, üstte sarı bir yapışkan not. */
const Papers = () => (
  <g>
    <g transform="rotate(-5 980 990)">
      <rect x={790} y={918} width={380} height={240} fill="#8f897f" />
      <rect x={800} y={908} width={380} height={240} fill="#b9b2a5" />
    </g>
    <g transform="rotate(3 980 990)">
      <rect x={810} y={930} width={370} height={230} fill="#cfc7b8" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect key={index} x={840} y={962 + index * 18} width={180 + ((index * 53) % 120)} height={5} fill="#8d8678" />
      ))}
    </g>
    <rect x={1080} y={920} width={92} height={86} fill="#e1c45a" transform="rotate(8 1126 963)" />
    <rect x={640} y={1010} width={190} height={9} rx={4} fill="#1f2937" transform="rotate(-24 735 1014)" />
  </g>
)

/** Masadaki sessiz kalabalık: kahve, baret, plan, kâğıt. */
export const DeskProps = ({ calm = false }: { calm?: boolean }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
    <Mug />
    <HardHat />
    {!calm && <Papers />}
    {!calm && <Blueprints />}
  </svg>
)
