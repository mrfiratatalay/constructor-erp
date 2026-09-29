import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { toScreen } from './Camera'
import { FileFly } from './FileFly'
import { placeAt, progress, type Pose } from './motion'

type FileMomentProps = {
  start: number
  /** Düğmenin dünyadaki yeri: dosya oradan çıkar. Kamera o an nereye bakıyorsa ekrandaki yeri ona göre hesaplanır. */
  button: { x: number; y: number }
  camera: Pose[]
  name: string
  sheets: string[]
}

/** İndirme anı: arka kararır, dosya düğmeden çıkıp ortaya oturur (Excel'in adı ve içindeki sayfalarla). */
export const FileMoment: React.FC<FileMomentProps> = ({ start, button, camera, name, sheets }) => {
  const frame = useCurrentFrame()
  if (frame < start) return null
  const from = toScreen(button, placeAt(start, camera))
  return (
    <>
      <AbsoluteFill style={{ background: `rgb(8 14 36 / ${0.55 * progress(frame, start, start + 14)})` }} />
      <FileFly from={from} to={{ x: 1300, y: 470 }} name={name} sheets={sheets} start={start} />
    </>
  )
}
