import type { CSSProperties } from 'react'
import { OLD_WORLD_FONT } from './oldWorld'

export const TONES: Record<string, string> = {
  blue: '#3b82f6',
  orange: '#f97316',
  violet: '#8b5cf6',
  teal: '#14b8a6',
  green: '#22c55e',
  gray: '#64748b',
}

type Props = {
  app: string
  from?: string
  text: string
  tone?: string
  icon?: string
  style?: CSSProperties
}

/**
 * "Önceki dünya"nın genel bildirim kartı: her uygulamadan, her gruptan ayrı ayrı gelen mesajlar.
 * Bilerek İskele ERP arayüzüne benzemez: başka yazı tipi, koyu cam kart, rastgele uygulama renkleri.
 */
export const NotificationCard = ({ app, from, text, tone = 'blue', icon = '💬', style }: Props) => (
  <div style={{ width: 420, padding: '14px 16px', borderRadius: 22, background: 'rgb(22 27 38 / 0.9)',
    boxShadow: '0 18px 40px rgb(0 0 0 / 0.38), inset 0 0 0 1px rgb(255 255 255 / 0.08)', color: '#f1f5f9',
    fontFamily: OLD_WORLD_FONT, display: 'flex', gap: 13, alignItems: 'flex-start', ...style }}>
    <div style={{ flex: 'none', width: 40, height: 40, borderRadius: 11, background: TONES[tone] ?? TONES.blue,
      display: 'grid', placeItems: 'center', fontSize: 20 }}>
      {icon}
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#94a3b8' }}>
        <span>{app}</span>
        <span>şimdi</span>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.35, marginTop: 2 }}>
        {from && <b style={{ fontWeight: 600 }}>{from}: </b>}
        {text}
      </div>
    </div>
  </div>
)
