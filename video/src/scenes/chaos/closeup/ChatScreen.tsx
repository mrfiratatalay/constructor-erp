import type { ReactNode } from 'react'
import { useFilmTime } from '../../../film/clock'
import { easeOutCubic, progress } from '../../../motion/ease'
import { OLD_WORLD_FONT } from '../oldWorld'
import { ChatBubble, bubbleHeight, type ChatMessage } from './ChatBubble'

const StatusBar = () => (
  <div style={{ height: 46, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    padding: '0 28px 6px', fontSize: 15, fontWeight: 600, color: '#0f172a', background: '#fff' }}>
    <span>06:53</span>
    <span style={{ letterSpacing: 2 }}>▮▮▮ ◔ 41%</span>
  </div>
)

const Header = ({ title, members }: { title: string; members: string }) => (
  <div style={{ height: 72, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: '#fff',
    borderBottom: '1px solid #e2e8f0' }}>
    <span style={{ fontSize: 26, color: '#334155' }}>‹</span>
    <div style={{ width: 44, height: 44, borderRadius: 22, background: '#fdba74', display: 'grid', placeItems: 'center',
      fontSize: 22 }}>👷</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{title}</div>
      <div style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{members}</div>
    </div>
  </div>
)

type Props = {
  title: string
  members: string
  messages: ChatMessage[]
  /** Ekranın üstünde beliren katman (gelen arama). */
  overlay?: ReactNode
}

/**
 * Genel bir grup sohbeti: mesajlar alttan gelir, gelen her mesaj eskileri yukarı iter. Çok mesaj gelince ilk
 * mesajlar (ve içindeki fotoğraf) ekranın üstünden çıkıp kaybolur: "yapılan iş başka yerde".
 */
export const ChatScreen = ({ title, members, messages, overlay }: Props) => {
  const t = useFilmTime()
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: OLD_WORLD_FONT,
      background: '#e7ebf0' }}>
      <StatusBar />
      <Header title={title} members={members} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden',
        padding: '0 14px 10px' }}>
        {messages.map((message) => {
          const enter = message.t <= 0 ? 1 : progress(t, message.t, 0.28, easeOutCubic)
          if (enter <= 0) return null
          return (
            <div key={`${message.t}-${message.from}`} style={{ height: bubbleHeight(message) * enter, flex: 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: enter,
              transform: `scale(${0.94 + enter * 0.06})`, transformOrigin: 'bottom left' }}>
              <ChatBubble message={message} />
            </div>
          )
        })}
      </div>
      <div style={{ height: 66, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 18px',
        color: '#94a3b8', fontSize: 16, borderTop: '1px solid #e2e8f0' }}>
        Mesaj yazın…
      </div>
      {overlay}
    </div>
  )
}
