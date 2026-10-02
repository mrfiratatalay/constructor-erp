import { createContext, useContext, type ReactNode } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const FILM_SECONDS = 120

/** Saniyeyi kareye çevirir (render 30 fps). */
export const sec = (seconds: number): number => Math.round(seconds * FPS)

const FilmTime = createContext(0)

/**
 * Bütün sahneler filmin mutlak saniyesiyle çalışır: seslendirme dosyasındaki "at" zamanları ve ses efektleri
 * aynı saate bağlı olduğu için görüntü ile ses kaymaz.
 */
export const FilmClock = ({ children }: { children: ReactNode }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return <FilmTime.Provider value={frame / fps}>{children}</FilmTime.Provider>
}

export const useFilmTime = (): number => useContext(FilmTime)

/** Bir sahnenin içinde saati dondurur ya da geciktirir (ör. kaosun 13,3. saniyede donması). */
export const ClockOverride = ({ time, children }: { time: number; children: ReactNode }) => (
  <FilmTime.Provider value={time}>{children}</FilmTime.Provider>
)
