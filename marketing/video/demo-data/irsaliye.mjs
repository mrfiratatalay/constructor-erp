import { chromium } from 'playwright'

/**
 * Sevk irsaliyesi fotoğrafı, kodla: masanın üstünde hafif eğik duran bir kâğıt. Depocu kamyon çıkarken bunu çeker;
 * demo sevkiyatlarına ve çekimdeki bugünün sevkiyatına bu resimler eklenir. Firmalar hayalidir.
 */
export async function renderIrsaliyes(documents) {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM })
  const page = await browser.newPage({ viewport: { width: 1000, height: 1250 } })
  const images = []
  for (const document of documents) {
    await page.setContent(html(document))
    images.push(await page.screenshot({ type: 'jpeg', quality: 86 }))
  }
  await browser.close()
  return images
}

/** document: { number, day ('2026-09-29'), from, to, lines: [{ name, quantity, unit }] } */
function html({ number, day, from, to, lines }) {
  const rows = lines.map((line, index) => `<tr><td>${index + 1}</td><td>${line.name}</td><td>${line.quantity}</td><td>${line.unit}</td></tr>`)
  const date = day.split('-').reverse().join('.')
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}</style>
  <div class="desk"><div class="paper">
    <header><b>SEVK İRSALİYESİ</b><span>No: ${number}</span></header>
    <dl><dt>Gönderen</dt><dd>${from}</dd><dt>Teslim yeri</dt><dd>${to}</dd><dt>Sevk tarihi</dt><dd>${date}</dd></dl>
    <table><tr><th>#</th><th>Malzeme</th><th>Miktar</th><th>Birim</th></tr>${rows.join('')}</table>
    <footer><div>Teslim eden<i>~ M. Yılmaz</i></div><div>Teslim alan<i>~ imza</i></div></footer>
  </div></div>`
}

const STYLE = `
  body { margin: 0; font-family: 'DejaVu Sans', Arial, sans-serif; }
  .desk { width: 1000px; height: 1250px; display: grid; place-items: center;
    background: radial-gradient(circle at 30% 20%, #8a7560, #5b4a3a 70%); }
  .paper { width: 760px; height: 1020px; padding: 56px 60px; box-sizing: border-box; background: #fbfaf5;
    transform: rotate(-2.2deg); box-shadow: 0 30px 60px rgb(0 0 0 / .45); color: #1c2230; }
  header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid #1c2230;
    padding-bottom: 14px; } header b { font-size: 34px; letter-spacing: .04em; } header span { font-size: 22px; }
  dl { display: grid; grid-template-columns: 180px 1fr; gap: 10px; font-size: 22px; margin: 34px 0; }
  dt { color: #5b6577; } dd { margin: 0; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 22px; }
  th, td { border: 1.5px solid #9aa3b5; padding: 12px 10px; text-align: left; } th { background: #eef0f4; }
  footer { display: flex; justify-content: space-between; margin-top: 90px; font-size: 20px; color: #5b6577; }
  footer i { display: block; margin-top: 18px; font: italic 34px 'DejaVu Serif', serif; color: #1e40af; }`
