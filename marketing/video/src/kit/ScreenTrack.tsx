import type { CSSProperties } from 'react'
import { Img, staticFile, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import type { Screen } from './captures'
import { mix, progress } from './motion'

/**
 * Cihazın ekranında sırayla görünen çekimler. Her çekim kendi karesinde başlar, bir öncekinden nasıl geldiğini söyler:
 * kesme, yumuşak geçiş, yukarıdan aşağı açılma (işaretlerin satır satır dolması) ya da kaydırma. Kaydırma uzunsa
 * sayfanın tam boy şeridinden (strip) oynar; kısaysa (içerik yüksekliğinden az) iki görüntü birlikte kayar.
 */
export type Enter =
  | { kind: 'cut' }
  | { kind: 'fade' | 'wipe'; frames: number }
  | { kind: 'scroll'; frames: number; strip?: Screen; top: number; bottom: number }

export type Shot = { at: number; screen: Screen; enter?: Enter }

export const ScreenTrack: React.FC<{ shots: Shot[] }> = ({ shots }) => {
  const frame = useCurrentFrame()
  const index = Math.max(0, shots.findLastIndex((shot) => shot.at <= frame))
  const shot = shots[index]
  const previous = shots[index - 1]
  const enter = shot.enter ?? { kind: 'cut' }
  if (!previous || enter.kind === 'cut' || frame >= shot.at + enter.frames) {
    return <ScreenImage screen={shot.screen} />
  }
  const amount = progress(frame, shot.at, shot.at + enter.frames)
  if (enter.kind === 'scroll') {
    return <Scroll from={previous.screen} to={shot.screen} enter={enter} amount={amount} />
  }
  const reveal: CSSProperties =
    enter.kind === 'fade' ? { opacity: amount } : { clipPath: `inset(0 0 ${(1 - amount) * 100}% 0)` }
  return (
    <>
      <ScreenImage screen={previous.screen} />
      <ScreenImage screen={shot.screen} style={reveal} />
    </>
  )
}

export const ScreenImage: React.FC<{ screen: Screen; style?: CSSProperties }> = ({ screen, style }) => (
  <Img
    src={staticFile(screen.src)}
    style={{ position: 'absolute', left: 0, top: 0, width: screen.width, height: screen.height, ...style }}
  />
)

/**
 * Kaydırma: sabit parçalar (başlık, alt çubuk) varılan ekrandan gelir, aradaki içerik sayfanın tam boy şeridinden
 * kayar. Şeritteki y sayfadaki y'dir; ekranda görünen y = sayfadaki y - kaydırma.
 */
const Scroll: React.FC<{
  from: Screen
  to: Screen
  enter: Extract<Enter, { kind: 'scroll' }>
  amount: number
}> = ({ from, to, enter, amount }) => {
  const scroll = mix(from.scrollY ?? 0, to.scrollY ?? 0, amount)
  if (!enter.strip) return <Glide from={from} to={to} enter={enter} scroll={scroll} />
  const viewport: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: enter.top,
    width: to.width,
    height: enter.bottom - enter.top,
    overflow: 'hidden',
    background: COLOR.canvas,
  }
  return (
    <>
      <ScreenImage screen={to} />
      <div style={viewport}>
        <ScreenImage screen={enter.strip} style={{ top: -(scroll + enter.top) }} />
      </div>
    </>
  )
}

/**
 * Kısa kaydırma, şeritsiz: iki görüntünün içerik bölümleri aynı hızla kayar, birinin bittiği yerde öteki başlar.
 * Her görüntü kendi içerik alanına kırpılır: başlık gibi sabit parçalar kayan içeriğe karışmaz.
 */
const Glide: React.FC<{
  from: Screen
  to: Screen
  enter: Extract<Enter, { kind: 'scroll' }>
  scroll: number
}> = ({ from, to, enter, scroll }) => {
  const height = enter.bottom - enter.top
  const band = (screen: Screen) => {
    const shift = (screen.scrollY ?? 0) - scroll
    return (
      <div style={{ position: 'absolute', left: 0, top: shift, width: screen.width, height, overflow: 'hidden' }}>
        <ScreenImage screen={screen} style={{ top: -enter.top }} />
      </div>
    )
  }
  return (
    <>
      <ScreenImage screen={to} />
      <div style={{ position: 'absolute', left: 0, top: enter.top, width: to.width, height, overflow: 'hidden', background: COLOR.canvas }}>
        {band(from)}
        {band(to)}
      </div>
    </>
  )
}
