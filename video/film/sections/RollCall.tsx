// 00:51.6–00:56.6 · Şef yoklamayı sahada, telefondan alır: Ali Geldi, Emre İzinli, Hasan Yarım gün, Murat Geldi.
import { PhoneShot } from '../components/Shots'

export const RollCall: React.FC = () => (
  <PhoneShot clip="rollcall"
    map={[[0, 0.6], [1.3, 2.7], [1.3, 3.0], [2.4, 4.9], [2.4, 5.2], [3.4, 7.2], [3.4, 7.5], [4.4, 9.8], [5.0, 11.4]]}
    camera={{ scale: [[0, 1.0], [5.0, 1.04]], rotateY: [[0, 8], [1.2, 0]], y: [[0, 10], [5.0, -6]] }} />
)
