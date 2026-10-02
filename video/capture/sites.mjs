// Part 3: şef Ayşe'nin masaüstü: şantiye listesi → Yomra Park sohbeti → not yazılır, fotoğrafla gönderilir → Saha.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open, siteIdOf } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'
import { literal, sql } from './lib/sql.mjs'
import { post } from './seed/team.mjs'
import { CACHE } from './lib/stack.mjs'

const SCENE = 'sites'
const NOTE = '2. kat kolon kalıpları tamamlandı.'

const browser = await openBrowser()
const ayse = await asPerson(browser, 'ayse')
const yomra = await siteIdOf(ayse, 'Yomra Park Konutları')

const list = await open(ayse, '/santiyeler')
await settle(list, 800)
await shoot(list, SCENE, 'list', { yomra: '.site-list >> text=Yomra Park Konutları' })

const chat = await open(ayse, `/santiyeler/${yomra}`)
await settle(chat, 1200)
const targets = {
  composer: 'textarea', voice: '.audio-note', pump: 'text=Pompa geldi, döküm 13:30’da.', header: '.site-heading',
  fieldTab: 'text=Saha',
}
await shoot(chat, SCENE, 'chat', targets)
const composer = chat.locator('textarea').first()
await composer.click()
for (let length = 3; length <= NOTE.length; length += 3) {
  await composer.fill(NOTE.slice(0, Math.min(length, NOTE.length)))
  await shoot(chat, SCENE, `type-${String(length).padStart(2, '0')}`)
}
await composer.fill(NOTE)
await shoot(chat, SCENE, 'typed', targets)

// Gönderim: fotoğrafla birlikte, gerçek API'den, Ayşe olarak. Saati spesifikasyondaki 14:20'ye çekilir.
const id = await post(ayse, yomra, { body: NOTE, field: true, file: `${CACHE}/photo-formwork.png` })
sql(`update posts set created_at = timestamp '2026-10-02 14:20' at time zone 'Europe/Istanbul' where id = ${literal(id)};`)
await composer.fill('')
await chat.reload()
await settle(chat, 1500)
await shoot(chat, SCENE, 'sent', { ...targets, note: `text=${NOTE}` })

const field = await open(ayse, `/santiyeler/${yomra}/saha`)
await settle(field, 1200)
await shoot(field, SCENE, 'field', {
  first: `text=${NOTE}`, demir: 'text=İnşaat demiri şantiyeye teslim edildi.', pompa: 'text=Beton pompasının geliş saati bekleniyor.',
  hero: '.field-hero',
})
await browser.close()
console.log('Part 3 çekimleri tamam.')
