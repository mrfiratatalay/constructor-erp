/**
 * Boş demo veritabanına reklam videolarının dünyasını kurar (README'deki sırayla çalıştırılır).
 * Her şey API'den geçer, iş kuralları uygulamadaki gibi işler; API'nin geçmişe yazamadığı saatler sonda
 * SQL ile kaydırılır. Çekim betiklerinin ihtiyaç duyduğu kimlikler .ids.json'a yazılır.
 */
import { writeFileSync } from 'node:fs'
import { seedDepot } from './seedDepot.mjs'
import { PROGRESS_SITE } from './progress.mjs'
import { seedProgress } from './seedProgress.mjs'
import { joinCompany, signIn, signInAs } from './session.mjs'
import { APP_WORKERS, CREWS, LISTED_PEOPLE, OWNER, SITES, STAFF } from './world.mjs'
import { pastWorkdays, planMonth, storyDays } from './puantajPlan.mjs'
import { runSql } from './sql.mjs'

const API = process.env.DEMO_API ?? 'http://127.0.0.1:8080/api'

const owner = await signIn(API, { email: OWNER.email, password: OWNER.password })
await requireEmpty(owner)
const sites = await createSites(owner)
const people = await joinEveryone(owner)
const { today, entries } = await buildRoster(owner)
const marks = await markMonth(owner, entries, today)
const shipments = await seedDepot(await signInAs(owner, people.mehmet), today, sites)
const calendar = { today, ...storyDays(pastWorkdays(today)) }
const progress = await seedProgress(await signInAs(owner, people.ahmet), sites[PROGRESS_SITE], calendar)
runSql('retime.sql', { ahmet: people.ahmet, serkan: people.serkan })
runSql('depot-retime.sql')
runSql('sites-retime.sql')
runSql('progress-retime.sql')

writeFileSync(new URL('.ids.json', import.meta.url), JSON.stringify({ today, sites, people }, null, 2))
console.log(`Hazır: ${SITES.length} şantiye, ${entries.length} yoklama kalemi, ${marks} geçmiş işaret, ${shipments} sevkiyat, ${progress} ilerleme girişi (${today}).`)

async function requireEmpty(session) {
  if ((await session.get('/sites')).length > 0) {
    throw new Error('Demo veritabanı boş değil. Sıfırlamak için README’ye bak.')
  }
}

async function createSites(session) {
  const ids = {}
  for (const site of SITES) {
    const created = await session.post('/sites', { name: site.name, address: site.address })
    if (site.completed) {
      await session.put(`/sites/${created.id}`, { name: site.name, address: site.address, status: 'COMPLETED' })
    }
    ids[site.key] = created.id
  }
  return ids
}

/** Herkes firmanın tek bağlantısından katılır; patron sonra şefleri ve depo sorumlusunu atar. */
async function joinEveryone(session) {
  const url = (await session.get('/company/join-link')).url
  const token = url.slice(url.lastIndexOf('/') + 1)
  const ids = {}
  for (const person of [...STAFF, ...APP_WORKERS]) {
    ids[person.key] = (await joinCompany(API, token, person)).id
  }
  for (const person of STAFF) {
    const change = { fullName: person.name, phone: person.phone, role: person.role, active: true }
    await session.patch(`/team/members/${ids[person.key]}`, change)
  }
  return ids
}

/** Uygulamadaki çalışanlar listeye kendiliğinden girer, yalnızca görevleri yazılır; ötekiler adıyla eklenir. */
async function buildRoster(session) {
  const localToday = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' })
  const { today, entries: linked } = await session.get(`/puantaj?from=${localToday}&to=${localToday}`)
  const roster = []
  for (const worker of APP_WORKERS) {
    const entry = linked.find((candidate) => candidate.name === worker.name)
    await session.patch(`/puantaj/entries/${entry.id}`, { kind: 'PERSON', name: worker.name, trade: worker.trade })
    roster.push({ ...worker, id: entry.id, kind: 'PERSON' })
  }
  for (const [kind, list] of [['PERSON', LISTED_PEOPLE], ['CREW', CREWS]]) {
    for (const item of list) {
      const created = await session.post('/puantaj/entries', { kind, ...item, key: undefined })
      roster.push({ ...item, id: created.id, kind })
    }
  }
  return { today, entries: roster }
}

async function markMonth(session, entries, today) {
  const plan = planMonth(entries, pastWorkdays(today))
  for (const { entry, day, status, overtimeHours, note } of plan) {
    await session.put(`/puantaj/days/${day}/entries/${entry.id}`, { status, overtimeHours, note })
  }
  return plan.length
}
