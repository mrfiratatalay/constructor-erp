import { TONES } from '../NotificationCard'
import { FormworkPhoto } from './FormworkPhoto'

export type ChatMessage = {
  t: number
  from: string
  text?: string
  voice?: string
  photo?: string
  tone: string
}

/** Balonun yaklaşık yüksekliği: yeni mesaj geldiğinde eskileri bu kadar yumuşakça yukarı iter. */
export const bubbleHeight = (message: ChatMessage): number => {
  if (message.photo) return 318
  if (message.voice) return 84
  return (message.text ?? '').length > 26 ? 104 : 80
}

const VoiceNote = ({ duration, tone }: { duration: string; tone: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
    <div style={{ width: 34, height: 34, borderRadius: 17, background: TONES[tone], display: 'grid', placeItems: 'center',
      color: '#fff', fontSize: 14 }}>▶</div>
    <svg width={150} height={28}>
      {Array.from({ length: 30 }, (_, index) => {
        const level = 5 + Math.abs(Math.sin(index * 1.7) * 18 + Math.sin(index * 0.6) * 4)
        return <rect key={index} x={index * 5} y={14 - level / 2} width={3} height={level} rx={1.5} fill="#94a3b8" />
      })}
    </svg>
    <span style={{ fontSize: 13, color: '#64748b' }}>{duration}</span>
  </div>
)

/** Gelen mesaj balonu: gönderen adı renkli, saat sağ altta. Metin, sesli not ya da fotoğraf. */
export const ChatBubble = ({ message }: { message: ChatMessage }) => (
  <div style={{ alignSelf: 'flex-start', maxWidth: message.photo ? 292 : 300, background: '#fff',
    borderRadius: '6px 18px 18px 18px', padding: message.photo ? 6 : '9px 13px 7px', boxShadow: '0 1px 1px rgb(0 0 0 / 0.08)' }}>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: TONES[message.tone], padding: message.photo ? '3px 7px 5px' : 0 }}>
      {message.from}
    </div>
    {message.photo && <FormworkPhoto width={280} height={210} />}
    {message.text && (
      <div style={{ fontSize: 17, lineHeight: 1.32, color: '#0f172a', padding: message.photo ? '6px 7px 0' : 0 }}>
        {message.text}
      </div>
    )}
    {message.voice && <VoiceNote duration={message.voice} tone={message.tone} />}
    <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 2, paddingRight: message.photo ? 6 : 0 }}>
      06:53
    </div>
  </div>
)
