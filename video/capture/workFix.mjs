// Part 6 ek kareler: saatler demo gününe çekildikten sonra ilerleme kartı ve görevin tamamlanması yeniden çekilir.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open, siteIdOf } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'
import { api } from './lib/stack.mjs'

const browser = await openBrowser()
const ayse = await asPerson(browser, 'ayse')
const yomra = await siteIdOf(ayse, 'Yomra Park Konutları')
const card = '.el-card:has-text("3. kat iç cephe"), .production-item:has-text("3. kat iç cephe")'
const board = await open(ayse, `/santiyeler/${yomra}/ilerleme`)
await settle(board, 1500)
await board.locator(card).first().evaluate((element) => element.scrollIntoView({ block: 'center' }))
await settle(board, 600)
await shoot(board, 'production', 'board-after-clean', { card, update: `:is(${card}) button:has-text("Güncelle")` })

const task = (await api(ayse, 'GET', `/api/sites/${yomra}/tasks`)).find((item) => item.title === '3. kat elektrik tesisatı kontrolü')
await api(ayse, 'PUT', `/api/tasks/${task.id}`, { title: task.title, note: null, assigneeId: task.assignee.id, dueDate: task.dueDate, priority: task.priority, status: 'TODO' })
const tasks = await open(ayse, `/santiyeler/${yomra}/gorevler`)
await settle(tasks, 1200)
await tasks.locator('text=3. kat elektrik tesisatı kontrolü').first().click()
await settle(tasks, 900)
await shoot(tasks, 'tasks', 'drawer', { drawer: '.el-drawer:visible', done: '.el-drawer:visible >> text=Tamamlandı' })
await tasks.locator('.el-drawer:visible >> text=Tamamlandı').first().click()
await settle(tasks, 1000)
await shoot(tasks, 'tasks', 'done', { drawer: '.el-drawer:visible', done: '.el-drawer:visible >> text=Tamamlandı' })
await browser.close()
