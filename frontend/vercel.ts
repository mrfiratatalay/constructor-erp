import { deploymentEnv, routes, type VercelConfig } from '@vercel/config/v1'

/**
 * Arayüzün Vercel yapılandırması. /api istekleri Render'daki backend'e vekil olarak gider: tarayıcı için arayüz ve API
 * aynı adrestedir (oturum çerezi SameSite=Strict ve Path=/api, backend'in köken denetimi same-origin ister). Vercel her
 * isteğe yalnızca ikisinin bildiği PROXY_SECRET'ı ekler; backend onu taşımayan isteği reddeder ve kişinin gerçek
 * adresini Vercel'in bildirdiğinden okur, böylece giriş deneme sınırları kişi başına kalır (ProxyGate).
 *
 * İsteğe başlık ekleyen kural yüzünden Vercel her şeyi tek bir `routes` listesinde ister. Liste yukarıdan aşağı işler:
 * önce yanıt başlıkları (continue: sonraki kurala devam eder), sonra /api vekili, sonra var olan dosya (filesystem),
 * en son tek sayfalık uygulamanın index.html'i. Sıra bozulursa /assets'teki dosyalar bile index.html döner.
 */
const apiOrigin = process.env.API_ORIGIN?.replace(/\/+$/, '')
if (!apiOrigin) {
  throw new Error('API_ORIGIN gerekli: Render servisinin adresi, ör. https://constructor-erp-api.onrender.com')
}

/** docker/nginx-security-headers.conf ile aynı başlıklar (Docker ve VPS'te nginx yazar): biri değişince öbürü de. */
const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
    "media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; " +
    "manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), payment=(), usb=()',
}

/** Değer derlemeye girmez: $PROXY_SECRET istek anında Vercel'in ortam değişkeninden dolar. */
const apiProxy = routes.rewrite('/api/(.*)', `${apiOrigin}/api/$1`, {
  requestHeaders: { 'x-proxy-secret': deploymentEnv('PROXY_SECRET') },
})

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  routes: [
    { src: '^/(?!api/).*$', headers: SECURITY_HEADERS, continue: true },
    // Dosya adlarında özet (hash) var: bir kez indirilir. Service worker her açılışta yenilenir.
    { src: '^/assets/.*$', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }, continue: true },
    { src: '^/sw\\.js$', headers: { 'Cache-Control': 'no-cache' }, continue: true },
    // API cevapları kişiye ve firmaya özeldir: CDN hiçbirini saklamaz. Güvenlik başlıklarını backend yazar.
    { src: '^/api/.*$', headers: { 'x-vercel-enable-rewrite-caching': '0' }, continue: true },
    apiProxy,
    { handle: 'filesystem' },
    { src: '^/.*$', dest: '/index.html' },
  ],
}
