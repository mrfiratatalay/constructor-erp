import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { keyframes } from '../../motion/ease'
import { CallBanner } from './closeup/CallBanner'
import type { ChatMessage } from './closeup/ChatBubble'
import { ChatScreen } from './closeup/ChatScreen'
import { DeskSurface } from './closeup/DeskSurface'
import { PhoneDevice } from './closeup/PhoneDevice'
import { buzzOffset } from './props/buzz'

const [START, END] = cues.shots.chat

const HISTORY: ChatMessage[] = [
  { t: 0, from: 'Hakan', text: 'Vinç operatörü 7de burada', tone: 'blue' },
  { t: 0, from: 'Bayram Usta', text: 'Tamam', tone: 'orange' },
  { t: 0, from: 'Ayşe', text: 'Günaydın. 4. blokta söküm bugün.', tone: 'teal' },
  { t: 0, from: 'Selin', text: 'İrsaliyeleri kim aldı?', tone: 'violet' },
]

/** 4,7 – 6,4 sn, "Mesajlar başka yerde": grup sohbeti akarken bir de şantiye şefi arar. */
export const ChatShot = () => {
  const t = useFilmTime()
  const scale = keyframes(t, [[START, 1.0], [END, 1.06]])
  const angle = keyframes(t, [[START, -9], [END, -7]])
  return (
    <AbsoluteFill>
      <DeskSurface shift={(t - START) * 30} />
      <PhoneDevice x={980} y={548} scale={scale} angle={angle} shake={buzzOffset(t, 3)}>
        <ChatScreen title="Yomra Şantiye Grubu" members="Hakan, Bayram Usta, Ayşe, Selin ve 14 kişi"
          messages={[...HISTORY, ...cues.chatMessages]}
          overlay={<CallBanner at={cues.callBanner.t} name={cues.callBanner.name} detail={cues.callBanner.detail} />} />
      </PhoneDevice>
    </AbsoluteFill>
  )
}
