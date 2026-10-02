// Kişinin kendi oturumuyla tarayıcı: patron şifreyle, ekip katılma bağlantısıyla aldığı oturumla (seed'de saklanır).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { openContext } from './browser.mjs'
import { CACHE, api, login, secrets } from './stack.mjs'

export const asPerson = async (browser, who, device = 'desktop') => {
  const context = await openContext(browser, device)
  if (who === 'patron') {
    await login(context, secrets().patron)
  } else {
    const saved = JSON.parse(readFileSync(join(CACHE, 'sessions', `${who}.json`), 'utf8'))
    await context.addCookies(saved.cookies)
  }
  return context
}

export const siteIdOf = async (context, name) => {
  const sites = await api(context, 'GET', '/api/sites')
  return sites.find((site) => site.name === name).id
}

export const open = async (context, path) => {
  const page = await context.newPage()
  await page.goto(`${secrets().web}${path}`)
  return page
}
