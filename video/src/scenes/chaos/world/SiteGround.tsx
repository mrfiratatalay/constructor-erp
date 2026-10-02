/** Şantiye çiti, tabela ve istif: pencerenin alt kenarında, pusun içinde. */
export const SiteGround = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id="ground-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9b9a6" />
        <stop offset="1" stopColor="#8c8b90" />
      </linearGradient>
    </defs>
    <rect x={0} y={628} width={1920} height={60} fill="url(#ground-fade)" />
    <g fill="#5f6a7e">
      {Array.from({ length: 30 }, (_, index) => (
        <rect key={index} x={240 + index * 48} y={606} width={46} height={44} />
      ))}
    </g>
    <rect x={240} y={606} width={1440} height={2} fill="#efcf9f" opacity={0.55} />
    <g transform="translate(286 578)">
      <rect width={236} height={60} fill="#a9a59d" />
      <rect width={236} height={14} fill="#46557a" />
      <text x={118} y={36} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={800} fontSize={15}
        letterSpacing={1.2} fill="#3b4255">
        YOMRA PARK KONUTLARI
      </text>
      <text x={118} y={52} textAnchor="middle" fontFamily="'Plus Jakarta Sans'" fontWeight={600} fontSize={10}
        letterSpacing={2} fill="#4b5263">
        ATALAY YAPI
      </text>
      <rect x={30} y={60} width={5} height={24} fill="#4a5265" />
      <rect x={200} y={60} width={5} height={24} fill="#4a5265" />
    </g>
    <g fill="#7b6a58">
      <rect x={1520} y={590} width={110} height={10} />
      <rect x={1526} y={580} width={98} height={10} />
      <rect x={1532} y={570} width={86} height={10} />
    </g>
  </svg>
)
