// Video veritabanına doğrudan SQL: yalnızca demo kayıtlarının saatini/tarihini gerçekçi kılmak için.
// Kayıtlar API'den (gerçek ürün kurallarıyla) yazılır; burada sadece "ne zaman" bilgisi düzeltilir.
import { execFileSync } from 'node:child_process'

const CONTAINER = 'iskele-video-postgres-1'

export const sql = (statement) =>
  execFileSync('docker', ['exec', '-i', CONTAINER, 'psql', '-U', 'santiye', '-d', 'santiye', '-v', 'ON_ERROR_STOP=1',
    '-q', '-t', '-A'], { input: statement, encoding: 'utf8' }).trim()

/** Metni SQL dizgesine çevirir (tek tırnak kaçışı). */
export const literal = (text) => `'${String(text).replaceAll("'", "''")}'`
