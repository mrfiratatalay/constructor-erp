import imageCompression from 'browser-image-compression'

/**
 * Fotoğraf telefonda küçültülür: 4-5 MB'lık kamera fotoğrafı ~300 KB olur ve sahadaki zayıf internette
 * saniyeler içinde gider. Küçültme başarısız olursa (ör. tarayıcının okuyamadığı bir biçim) asıl dosya gider.
 */
export async function compressPhoto(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 1600,
      initialQuality: 0.8,
      fileType: 'image/jpeg',
      useWebWorker: true,
    })
    return new File([compressed], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}
