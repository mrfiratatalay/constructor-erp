import { useEffect, useState } from 'react'
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion'

export type Box = { x: number; y: number; width: number; height: number }
export type Capture = { src: string; boxes: Record<string, Box> }

const loaded = new Map<string, Record<string, Box>>()

/**
 * Gerçek ürün çekimi: capture/*.mjs'in kaydettiği PNG ve o andaki öğe kutuları (CSS pikseli). Kutular imlecin
 * nereye gideceğini, kameranın nereye yaklaşacağını söyler; JSON yüklenene kadar render bekletilir.
 */
export const useCapture = (scene: string, name: string): Capture => {
  const key = `${scene}/${name}`
  const [boxes, setBoxes] = useState(() => loaded.get(key) ?? null)
  const [handle] = useState(() => (loaded.has(key) ? null : delayRender(`Çekim kutuları: ${key}`)))
  useEffect(() => {
    if (handle === null) return
    fetch(staticFile(`capture/${key}.json`))
      .then((response) => response.json())
      .then((json: Record<string, Box>) => {
        loaded.set(key, json)
        setBoxes(json)
        continueRender(handle)
      })
      .catch((error: Error) => cancelRender(error))
  }, [handle, key])
  return { src: staticFile(`capture/${key}.png`), boxes: boxes ?? {} }
}
