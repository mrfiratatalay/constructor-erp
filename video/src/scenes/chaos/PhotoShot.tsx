import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { keyframes } from '../../motion/ease'
import type { ChatMessage } from './closeup/ChatBubble'
import { ChatScreen } from './closeup/ChatScreen'
import { DeskSurface } from './closeup/DeskSurface'
import { PhoneDevice } from './closeup/PhoneDevice'

const [START, END] = cues.shots.photo

const BEFORE: ChatMessage[] = [
  { t: 0, from: 'Selin', text: 'Bugün kaç kişi var?', tone: 'violet' },
  { t: 0, from: 'Ayşe', text: 'Kalıp kontrolü bitti mi?', tone: 'teal' },
  { t: 0, from: 'Hakan', photo: 'formwork', text: '2. kat kolon kalıpları tamam ✔', tone: 'blue' },
]

/**
 * 9,4 – 11,15 sn, "Yapılan iş başka yerde": tamamlanan işin fotoğrafı sohbete düşer, ardından gelen mesajlar onu
 * ekranın üstünden iter. İş yapılmıştır ama kaydı kaybolmuştur.
 */
export const PhotoShot = () => {
  const t = useFilmTime()
  const scale = keyframes(t, [[START, 1.1], [END, 1.02]])
  const y = keyframes(t, [[START, 600], [END, 548]])
  return (
    <AbsoluteFill>
      <DeskSurface shift={(t - START) * 24} />
      <PhoneDevice x={960} y={y} scale={scale} angle={6}>
        <ChatScreen title="Yomra Şantiye Grubu" members="Hakan, Bayram Usta, Ayşe, Selin ve 14 kişi"
          messages={[...BEFORE, ...cues.photoThread]} />
      </PhoneDevice>
    </AbsoluteFill>
  )
}
