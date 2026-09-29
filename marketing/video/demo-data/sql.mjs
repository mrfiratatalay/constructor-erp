import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = (name) => fileURLToPath(new URL(name, import.meta.url))
const composeFile = here('../../../docker-compose.yml')

/**
 * Bu klasördeki bir SQL dosyasını demo veritabanında çalıştırır. Değişkenler psql'e -v ile gider, dosyada
 * :'ad' diye okunur. PostgreSQL Docker'dadır (docker compose up -d).
 */
export function runSql(fileName, variables = {}) {
  const args = ['compose', '-f', composeFile, 'exec', '-T', 'postgres', 'psql', '-q', '-v', 'ON_ERROR_STOP=1']
  for (const [name, value] of Object.entries(variables)) args.push('-v', `${name}=${value}`)
  args.push('-U', 'santiye', '-d', process.env.DEMO_DB ?? 'santiye_demo')
  execFileSync('docker', args, { input: readFileSync(here(fileName)), stdio: ['pipe', 'inherit', 'inherit'] })
}
