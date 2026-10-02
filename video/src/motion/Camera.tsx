import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'

export type CameraState = {
  /** Yatay/dikey kayma (piksel, odak katmanında). */
  x: number
  y: number
  /** 1 = dünya ekrana birebir; 1.08 = %8 yaklaşmış. */
  zoom: number
  /** Yakınlaşmanın merkezi (ekran pikseli). */
  focusX: number
  focusY: number
}

const resting: CameraState = { x: 0, y: 0, zoom: 1, focusX: 960, focusY: 540 }
const CameraContext = createContext<CameraState>(resting)

/** Sahneyi kameraya bağlar: içindeki her Layer kendi derinliğine göre kameranın hareketini izler. */
export const Camera = ({ state, children }: { state: CameraState; children: ReactNode }) => (
  <CameraContext.Provider value={state}>
    <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
  </CameraContext.Provider>
)

type LayerProps = {
  /** 0 = sonsuz uzak (kımıldamaz), 1 = odak düzlemi, 1'den büyük = kameraya odaktan yakın (daha çok kayar). */
  depth: number
  /** Alan derinliği: odak dışındaki katman bulanık. */
  blur?: number
  style?: CSSProperties
  children: ReactNode
}

/**
 * Parallax: kamera ilerlerken yakın katman uzak katmandan daha çok büyür ve kayar. 2.5D derinlik hissini bu verir;
 * her katman düz bir çizimdir, derinliği yalnızca hareketi taşır.
 */
export const Layer = ({ depth, blur = 0, style, children }: LayerProps) => {
  const camera = useContext(CameraContext)
  const scale = 1 + (camera.zoom - 1) * depth
  const transform = `translate(${-camera.x * depth}px, ${-camera.y * depth}px) scale(${scale})`
  return (
    <AbsoluteFill
      style={{
        transform,
        transformOrigin: `${camera.focusX}px ${camera.focusY}px`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}
