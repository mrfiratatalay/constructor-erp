// Video çekimlerinin izole yığını (arayüz 5190, API 8090, veritabanı 5440). Kullanıcının verisine dokunmaz.
//   node scripts/stack.mjs reset   → veritabanı ve medya silinir, yeni şifrelerle sıfırdan açılır
//   node scripts/stack.mjs up      → var olan veriyle açılır (Docker yeniden başladıktan sonra)
// İmajlar ilk kurulumda main'in temiz bir kopyasından derlenmiştir (iskele-video-api, iskele-video-web).
import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VIDEO = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = join(VIDEO, '..')
const SECRETS = join(VIDEO, '.cache', 'stack.json')

const password = () => `${randomBytes(12).toString('base64url')}Aa7!`

/** Şifreler her sıfırlamada yeniden üretilir ve yalnızca .cache/stack.json'da durur (git'e girmez). */
const freshSecrets = () => ({
  web: 'http://localhost:5190',
  admin: { name: 'İskele Destek', email: 'destek@iskele-erp.local', password: password() },
  bootstrap: { company: 'Kuzey Yapı', name: 'Kemal Arslan', email: 'kemal@kuzeyyapi.local', password: password() },
  patron: { name: 'Selim Atalay', email: 'selim@atalayyapi.local', password: password() },
})

const environment = (secrets) => ({
  ...process.env,
  API_PORT: '8090',
  DB_PORT: '5440',
  WEB_PORT: '5190',
  // Davet ve kurulum bağlantıları ürünün gerçek adresiyle üretilir: filmde uydurma bir adres görünmez.
  APP_BASE_URL: 'https://iskeleerp.vercel.app',
  COMPANY_NAME: secrets.bootstrap.company,
  OWNER_NAME: secrets.bootstrap.name,
  OWNER_EMAIL: secrets.bootstrap.email,
  OWNER_PASSWORD: secrets.bootstrap.password,
  PLATFORM_ADMIN_NAME: secrets.admin.name,
  PLATFORM_ADMIN_EMAIL: secrets.admin.email,
  PLATFORM_ADMIN_PASSWORD: secrets.admin.password,
})

const compose = (args, secrets) =>
  execFileSync('docker', ['compose', '-p', 'iskele-video', '--profile', 'app', ...args], {
    cwd: REPO,
    env: environment(secrets),
    stdio: 'inherit',
  })

const command = process.argv[2]
if (command === 'reset') {
  const secrets = freshSecrets()
  mkdirSync(dirname(SECRETS), { recursive: true })
  compose(['down', '-v'], secrets)
  writeFileSync(SECRETS, JSON.stringify(secrets, null, 1))
  compose(['up', '-d', '--wait'], secrets)
} else if (command === 'up') {
  if (!existsSync(SECRETS)) throw new Error('Önce: node scripts/stack.mjs reset')
  compose(['up', '-d', '--wait'], JSON.parse(readFileSync(SECRETS, 'utf8')))
} else {
  throw new Error('Kullanım: node scripts/stack.mjs reset | up')
}
console.log('Video yığını hazır: http://localhost:5190')
