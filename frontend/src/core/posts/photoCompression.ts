import imageCompression from 'browser-image-compression'
import compressionLibrary from 'browser-image-compression/dist/browser-image-compression.js?url'

/**
 * Küçültme ayrı bir işçide (web worker) yapılır, ekran donmaz. İşçi kütüphaneyi libURL'den yükler: verilmezse
 * kütüphane onu sürümü sabitlenmemiş bir CDN adresinden (jsdelivr) indirir ve o adreste yayımlanan her yeni sürüm
 * uygulamanın kendi kökeninde, kullanıcının oturumuyla çalışırdı. Dosya derlemeye girer, kendi sunucumuzdan gelir.
 */
function libraryUrl(): string {
  return new URL(compressionLibrary, window.location.href).href
}

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
      libURL: libraryUrl(),
    })
    return new File([compressed], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}
