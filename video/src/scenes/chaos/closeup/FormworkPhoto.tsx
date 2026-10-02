/**
 * Sahadan gönderilmiş fotoğraf: tamamlanmış kolon kalıpları, filiz demirleri, sabah göğü, bareti sarı bir usta.
 * Çizim fotoğraf gibi davranır: kırpılmış kadraj, hafif eğik ufuk, köşelerde lens kararması.
 */
export const FormworkPhoto = ({ width, height }: { width: number; height: number }) => (
  <svg viewBox="0 0 280 210" width={width} height={height} style={{ display: 'block', borderRadius: 12 }}>
    <defs>
      <linearGradient id="photo-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7d9cc4" />
        <stop offset="1" stopColor="#e9cfa8" />
      </linearGradient>
      <radialGradient id="photo-lens" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.6" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.35} />
      </radialGradient>
    </defs>
    <g transform="rotate(-2 140 105)">
      <rect x={-20} y={-20} width={320} height={160} fill="url(#photo-sky)" />
      <rect x={-20} y={128} width={320} height={110} fill="#8d8f93" />
      <rect x={-20} y={124} width={320} height={8} fill="#a7a9ad" />
      {[30, 100, 170, 240].map((x) => (
        <g key={x}>
          <rect x={x} y={52} width={30} height={76} fill="#b38455" />
          <rect x={x} y={52} width={30} height={4} fill="#d9a873" />
          <line x1={x + 15} y1={52} x2={x + 15} y2={128} stroke="#8a6440" strokeWidth={1.2} />
          <line x1={x - 18} y1={128} x2={x + 2} y2={76} stroke="#6b6f78" strokeWidth={2.4} />
          {[6, 15, 24].map((dx) => (
            <line key={dx} x1={x + dx} y1={52} x2={x + dx} y2={34} stroke="#4b505b" strokeWidth={1.6} />
          ))}
        </g>
      ))}
      <g transform="translate(206 112)">
        <rect x={-5} y={-24} width={11} height={24} rx={3} fill="#2f3b52" />
        <circle cx={0.5} cy={-29} r={5} fill="#c99c7c" />
        <path d="M-6 -30 a6.5 6.5 0 0 1 13 0z" fill="#facc15" />
        <rect x={-5} y={-24} width={11} height={4} fill="#f97316" />
      </g>
    </g>
    <rect width={280} height={210} fill="url(#photo-lens)" />
  </svg>
)
