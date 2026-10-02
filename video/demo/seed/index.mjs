// Demo verisinin tamamı: node demo/seed/index.mjs [--onboard]
// --onboard: firmayı API ile de kurar (geliştirme). Çekim hattında firma arayüzden kurulur, seed onun üstüne gelir.
// Kişilerin oturum çerezleri out/sessions.json'a yazılır: çekimler her ekranı doğru kişinin gözünden açar.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { Session } from './api.mjs'
import { seedAttendance } from './attendance.mjs'
import { backdatePosts, backdateShipmentPosts, settleVisits } from './backdate.mjs'
import { OWNER } from './content.mjs'
import { seedMaterials } from './materials.mjs'
import { onboardByApi } from './onboard.mjs'
import { seedMembers, seedRoster } from './people.mjs'
import { seedProduction } from './production.mjs'
import { seedSites, seedThreads } from './sites.mjs'
import { seedTasks } from './tasks.mjs'

const SESSIONS = fileURLToPath(new URL('../../out/sessions.json', import.meta.url))
const step = async (label, run) => {
  const started = Date.now()
  const result = await run()
  console.log(`✓ ${label} (${Date.now() - started} ms)`)
  return result
}

if (process.argv.includes('--onboard')) await step('firma kuruldu (API)', onboardByApi)
const owner = await new Session('kemal').login(OWNER.email, OWNER.password)
const people = await step('ekip katıldı', () => seedMembers(owner))
const sessions = { kemal: owner, ...Object.fromEntries(Object.entries(people).map(([key, value]) => [key, value.session])) }
const rosterIds = await step('puantaj cetveli', () => seedRoster(owner))
const siteIds = await step('şantiyeler ve kapak fotoğrafları', () => seedSites(owner))
const posted = await step('sohbet ve saha geçmişi', () => seedThreads(sessions, siteIds))
await step('ayın yoklaması', () => seedAttendance(owner, rosterIds))
await step('malzeme hareketleri', () => seedMaterials(sessions.mehmet, siteIds))
await step('imalat panosu', () => seedProduction(sessions.ayse, siteIds.yomra))
await step('görevler', () => seedTasks(sessions.ayse, siteIds.yomra, people))
await step('saatler yerine oturdu', () => {
  backdatePosts(posted)
  backdateShipmentPosts()
  settleVisits()
})
const cookies = Object.fromEntries(Object.entries(sessions).map(([key, session]) => [key, session.cookie]))
await writeFile(SESSIONS, JSON.stringify({ cookies, siteIds, rosterIds }, null, 2))
console.log('oturumlar:', SESSIONS)
