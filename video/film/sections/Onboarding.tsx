// 00:24.6–00:38.7 · Başlamak: tanıtım sitesi → paket → başvuru → platform yönetimi (ödeme, kurulum bağlantısı) →
// kurulum sihirbazı. Anahtarlar bölüm içi saniye: [film, klip]. Uzun yazmalar atlama kesmesiyle kısalır.
import { DesktopShot } from '../components/Shots'

export const Landing: React.FC = () => (
  <DesktopShot clip="landing" from="none"
    map={[[0, 1.2], [0.5, 1.6], [1.0, 2.55], [1.5, 3.75], [2.4, 5.9], [2.9, 6.9], [3.6, 7.9]]}
    camera={{ scale: [[0, 1], [1.6, 1], [2.3, 1.14], [2.9, 1.14], [3.4, 1.0]], ox: [[0, 50]], oy: [[0, 62]] }} />
)

export const Apply: React.FC = () => (
  <DesktopShot clip="apply" from="fade"
    map={[[0, 0.45], [1.05, 1.95], [1.05, 14.3], [1.75, 15.25], [2.3, 16.7]]}
    camera={{ scale: [[0, 1.3], [1.6, 1.3], [2.1, 1.12]], ox: [[0, 76]], oy: [[0, 34], [1.6, 40]] }} />
)

export const Admin: React.FC = () => (
  <DesktopShot clip="admin"
    map={[[0, 0.3], [0.5, 0.85], [0.5, 6.2], [1.35, 7.7], [1.35, 10.15], [2.8, 12.2]]}
    camera={{ scale: [[0, 1.08], [0.5, 1.08], [0.6, 1.16], [2.8, 1.2]], ox: [[0, 30], [0.5, 30], [0.6, 50]], oy: [[0, 30], [0.5, 30], [0.6, 46]] }} />
)

export const Setup: React.FC = () => (
  <DesktopShot clip="setup"
    map={[[0, 0.9], [1.0, 3.2], [1.0, 3.95], [1.6, 5.6], [1.6, 9.9], [2.1, 11.4], [2.9, 13.6], [2.9, 16.6], [3.6, 17.4], [4.3, 18.6], [5.4, 20.6]]}
    camera={{ scale: [[0, 1.22], [4.0, 1.22], [4.6, 1.0]], ox: [[0, 72], [4.0, 72], [4.6, 50]], oy: [[0, 48]] }} />
)
