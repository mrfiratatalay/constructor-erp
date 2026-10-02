import { OLD_WORLD_FONT } from '../oldWorld'

export const PEOPLE = [
  'Ali Yılmaz', 'Murat Demir', 'Emre Kaya', 'Hasan Çelik', 'Kemal Aydın', 'Yusuf Şahin', 'İbrahim Koç',
  'Osman Kurt', 'Mustafa Öz', 'Ramazan Ak', 'Serkan Tunç', 'Cem Yıldız', 'Tuncay Bal', 'Fatih Ok', 'Volkan Ay',
  'Erkan Uz', 'Sinan Tan', 'Orhan Gül',
]
const DAYS = 16
const MARKS = ['X', 'X', 'X', '½', 'X', '-', 'X', 'İ', 'X', '?']
const FILL: Record<string, string> = { '½': '#fef3c7', '-': '#fee2e2', 'İ': '#e0f2fe', '?': '#fde047' }

export const markAt = (row: number, day: number): string => MARKS[(row * 7 + day * 3 + (row % 3) * day) % MARKS.length]

/** Hücre ölçüleri; top: ilk kişi satırının ekran içindeki üst kenarı (araç çubuğu + formül + başlıklar). */
export const CELL = { nameWidth: 170, width: 64, height: 40, top: 194 }

const Toolbar = ({ file }: { file: string }) => (
  <div style={{ background: '#e5e9ef', borderBottom: '1px solid #cbd2dc' }}>
    <div style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, color: '#334155' }}>
      {file}
    </div>
    <div style={{ height: 38, display: 'flex', gap: 10, alignItems: 'center', padding: '0 14px' }}>
      {[28, 28, 46, 28, 28, 64, 28, 28, 90].map((width, index) => (
        <div key={index} style={{ width, height: 20, borderRadius: 4, background: '#cbd2dc' }} />
      ))}
    </div>
  </div>
)

const HeaderRow = () => (
  <div style={{ display: 'flex', height: CELL.height, background: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>
    <div style={{ width: CELL.nameWidth, padding: '10px 10px', borderRight: '1px solid #d6dce4' }}>Ad Soyad</div>
    {Array.from({ length: DAYS }, (_, day) => (
      <div key={day} style={{ width: CELL.width, textAlign: 'center', paddingTop: 10, borderRight: '1px solid #d6dce4' }}>
        {day + 1}
      </div>
    ))}
  </div>
)

const PersonRow = ({ name, row }: { name: string; row: number }) => (
  <div style={{ display: 'flex', height: CELL.height, borderTop: '1px solid #d6dce4', fontSize: 16 }}>
    <div style={{ width: CELL.nameWidth, padding: '10px 10px', borderRight: '1px solid #d6dce4', whiteSpace: 'nowrap' }}>
      {name}
    </div>
    {Array.from({ length: DAYS }, (_, day) => {
      const mark = markAt(row, day)
      return (
        <div key={day} style={{ width: CELL.width, textAlign: 'center', paddingTop: 10, background: FILL[mark],
          borderRight: '1px solid #d6dce4', color: mark === '-' ? '#b91c1c' : '#0f172a' }}>
          {mark}
        </div>
      )
    })}
  </div>
)

type Props = { file: string; formula: string }

/** Genel tablo uygulaması: elle tutulan puantaj. Renkli hücreler, soru işaretleri, "SON_v3" dosya adı. */
export const Spreadsheet = ({ file, formula }: Props) => (
  <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: OLD_WORLD_FONT, color: '#0f172a' }}>
    <Toolbar file={file} />
    <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px', fontSize: 15,
      borderBottom: '1px solid #cbd2dc' }}>
      <span style={{ color: '#64748b', fontStyle: 'italic' }}>fx</span>
      <span>{formula}</span>
    </div>
    <div style={{ padding: '10px 0 0 0' }}>
      <div style={{ fontSize: 19, fontWeight: 700, padding: '0 10px 10px' }}>EYLÜL PUANTAJ (kontrol edilecek!!)</div>
      <HeaderRow />
      {PEOPLE.map((name, row) => (
        <PersonRow key={name} name={name} row={row} />
      ))}
    </div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 38, background: '#e5e9ef', display: 'flex',
      gap: 4, padding: '6px 14px 0', fontSize: 14 }}>
      {['Eylül', 'Eylül (2)', 'SON', 'SON_v3', 'Ekim?'].map((tab, index) => (
        <div key={tab} style={{ padding: '5px 14px', borderRadius: '6px 6px 0 0',
          background: index === 3 ? '#fff' : 'transparent', color: index === 3 ? '#0f172a' : '#64748b' }}>
          {tab}
        </div>
      ))}
    </div>
  </div>
)
