// Part 3 ek kare: sohbet sesli nota kaydırılmış (seslendirme "sesli notlar" derken).
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open, siteIdOf } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const ayse = await asPerson(browser, 'ayse')
const chat = await open(ayse, `/santiyeler/${await siteIdOf(ayse, 'Yomra Park Konutları')}`)
await settle(chat, 1200)
await chat.locator('.audio-note').first().scrollIntoViewIfNeeded()
await chat.evaluate(() => {
  const note = document.querySelector('.audio-note')
  let scroller = note.parentElement
  while (scroller && scroller.scrollHeight <= scroller.clientHeight) scroller = scroller.parentElement
  if (scroller) scroller.scrollTop -= 160
})
await settle(chat, 600)
await shoot(chat, 'sites', 'voice', { voice: '.audio-note' })
await browser.close()
