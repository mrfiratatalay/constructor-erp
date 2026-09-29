import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = (name) => fileURLToPath(new URL(name, import.meta.url))
const composeFile = here('../../../docker-compose.yml')

/**
 * Bir SQL dosyasını demo veritabanında çalıştırır: ad verilirse bu klasörden, URL verilirse oradan. Değişkenler
 * psql'e -v ile gider, dosyada :'ad' diye okunur. PostgreSQL Docker'dadır (docker compose up -d).
 */
export function runSql(file, variables = {}) {
  const args = ['compose', '-f', composeFile, 'exec', '-T', 'postgres', 'psql', '-q', '-v', 'ON_ERROR_STOP=1']
  for (const [name, value] of Object.entries(variables)) args.push('-v', `${name}=${value}`)
  args.push('-U', 'santiye', '-d', process.env.DEMO_DB ?? 'santiye_demo')
  const source = file instanceof URL ? file : here(file)
  execFileSync('docker', args, { input: readFileSync(source), stdio: ['pipe', 'inherit', 'inherit'] })
}
