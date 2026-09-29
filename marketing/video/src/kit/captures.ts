/** Çekim defterindeki (src/captures/<ad>.json) kayıtlar: capture/recorder.mjs yazar, video okur. */
export type Box = { x: number; y: number; width: number; height: number }
export type Screen = { src: string; width: number; height: number; scrollY?: number }
export type Layer = { src: string; box: Box }

type Entry = { src?: string; width?: number; height?: number; scrollY?: number; box?: Box }

/** Bir çekimin defterine adla erişim; olmayan adda hemen hata verir: yanlış yazılan ad sessizce boş kare olmasın. */
export function capturesOf(manifest: Record<string, Entry>) {
  const entry = (name: string) => {
    const found = manifest[name]
    if (!found) throw new Error(`Çekimde "${name}" yok. capture betiğini çalıştır.`)
    return found
  }
  return {
    screen: (name: string) => entry(name) as Screen,
    layer: (name: string) => entry(name) as Layer,
    box: (name: string) => {
      const { box } = entry(name)
      if (!box) throw new Error(`"${name}" bir yer kaydı değil.`)
      return box
    },
  }
}
