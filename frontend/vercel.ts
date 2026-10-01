import { deploymentEnv, routes, type Rewrite, type VercelConfig } from '@vercel/config/v1'

/**
 * Arayüzün Vercel yapılandırması. /api istekleri Render'daki backend'e vekil olarak gider: tarayıcı için arayüz ve API
 * aynı adrestedir (oturum çerezi SameSite=Strict ve Path=/api, backend'in köken denetimi same-origin ister). Vercel her
 * isteğe yalnızca ikisinin bildiği PROXY_SECRET'ı ekler; backend onu taşımayan isteği reddeder ve kişinin gerçek
 * adresini Vercel'in bildirdiğinden okur, böylece giriş deneme sınırları kişi başına kalır (ProxyGate).
 */
const apiOrigin = process.env.API_ORIGIN?.replace(/\/+$/, '')
if (!apiOrigin) {
  throw new Error('API_ORIGIN gerekli: Render servisinin adresi, ör. https://constructor-erp-api.onrender.com')
}

/** docker/nginx-security-headers.conf ile aynı başlıklar (Docker ve VPS'te nginx yazar): biri değişince öbürü de. */
const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
      "media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; " +
      "manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), payment=(), usb=()' },
]

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  rewrites: [
    // Başlık ekleyen yönlendirmeyi @vercel/config 0.7.2'nin tipi Route sayar; Vercel onu rewrites içinde kabul eder
    // (vercel.ts belgesindeki örnek). Değer derlemeye girmez: $PROXY_SECRET istek anında Vercel'in ortamından dolar.
    routes.rewrite('/api/(.*)', `${apiOrigin}/api/$1`, {
      requestHeaders: { 'x-proxy-secret': deploymentEnv('PROXY_SECRET') },
    }) as Rewrite,
    // Tek sayfalık uygulama: dosyası olmayan her adres index.html'e düşer, yönlendirmeyi Vue Router yapar. /api hiçbir
    // sırada buraya düşmez (başlık ekleyen yönlendirme ayrı biçimde üretilir).
    routes.rewrite('/:path((?!api/).*)', '/index.html'),
  ],
  headers: [
    // API cevapları kişiye ve firmaya özeldir: CDN hiçbirini saklamaz. Başlıklarını backend (Spring Security) yazar.
    routes.header('/api/(.*)', [{ key: 'x-vercel-enable-rewrite-caching', value: '0' }]),
    routes.header('/:path((?!api/).*)', SECURITY_HEADERS),
    // Dosya adlarında özet (hash) var: bir kez indirilir. Service worker her açılışta yenilenir.
    routes.header('/assets/(.*)', [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]),
    routes.header('/sw.js', [{ key: 'Cache-Control', value: 'no-cache' }]),
  ],
}
