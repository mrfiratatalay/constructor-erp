export const DESK_TOP = 700

/** Ahşap damarları: uzak kenara doğru sıklaşan hafif eğri çizgiler (perspektif). */
const Grain = () => (
  <g stroke="#000" strokeWidth={1.2} fill="none" opacity={0.18}>
    {Array.from({ length: 14 }, (_, index) => {
      const y = DESK_TOP + 8 + (index * index) * 2.1 + index * 6
      const bend = 4 + index * 1.5
      return <path key={index} d={`M-20 ${y} C600 ${y - bend} 1300 ${y + bend} 1940 ${y - bend / 2}`} />
    })}
  </g>
)

/** Pencereden düşen sıcak ışık lekeleri: her cam bölmesi masaya bir parlaklık bırakır. */
const WindowLight = () => {
  const patches = [
    'M300 704 L700 704 L640 760 L190 760Z',
    'M735 704 L1176 704 L1150 760 L690 760Z',
    'M1214 704 L1650 704 L1700 760 L1210 760Z',
  ]
  return (
    <g fill="#ffcf8c" opacity={0.16} style={{ mixBlendMode: 'screen' }}>
      {patches.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

/** Masa yüzeyi: koyu ahşap, uzak kenarı pencereden ışık alır, yakını gölgede kalır. */
export const Desk = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', overflow: 'visible' }}>
    <defs>
      <linearGradient id="desk-wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a4434" />
        <stop offset="0.12" stopColor="#3f3027" />
        <stop offset="0.45" stopColor="#2a2019" />
        <stop offset="1" stopColor="#130f0c" />
      </linearGradient>
      <radialGradient id="desk-screen-spill" cx="0.5" cy="0" r="0.6">
        <stop offset="0" stopColor="#c7d8ff" stopOpacity={0.22} />
        <stop offset="1" stopColor="#c7d8ff" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-400} y={DESK_TOP} width={2720} height={700} fill="url(#desk-wood)" />
    <Grain />
    <WindowLight />
    <ellipse cx={845} cy={790} rx={420} ry={150} fill="url(#desk-screen-spill)" />
    <rect x={-40} y={DESK_TOP} width={2000} height={2.5} fill="#f0c58a" opacity={0.6} />
  </svg>
)
