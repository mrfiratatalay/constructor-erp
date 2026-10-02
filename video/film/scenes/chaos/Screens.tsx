// Kaostaki ekranlar: dizüstünde elle tutulan bir puantaj tablosu (sürüm sürüm kopyalanmış dosya), telefonda kilit
// ekranına üst üste düşen bildirimler.
import { FONT } from '../../theme'

const NAMES = ['Ali Yılmaz', 'Murat Demir', 'Emre Kaya', 'Hasan Koç', 'İbrahim A.', 'Kadir Ö.', 'Osman K.', 'Cem A.', 'Yusuf P.']
const MARKS = ['X', 'X', '1', 'X', '½', 'X', '', 'X', '?', 'X', 'X', '1', '', 'X']

export const Spreadsheet: React.FC<{ time: number; flicker?: number }> = ({ time, flicker = 0 }) => {
  const selected = Math.floor(time * 2.2) % 14
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#111' }}>
      <div style={{ height: 34, background: '#e9ecef', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, fontSize: 13, color: '#334155' }}>
        <b>Puantaj_Ekim_SON_v3 (2).xlsx</b><span style={{ color: '#dc2626' }}>● Kaydedilmedi</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(14, 1fr)`, borderTop: '1px solid #cbd5e1' }}>
        <div style={{ background: '#f1f5f9', padding: 6, fontWeight: 700 }}>Ad</div>
        {MARKS.map((_, i) => <div key={i} style={{ background: '#f1f5f9', padding: 6, textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>{i + 9}</div>)}
        {NAMES.map((name, row) => [
          <div key={name} style={{ padding: 6, borderTop: '1px solid #e2e8f0' }}>{name}</div>,
          ...MARKS.map((mark, col) => {
            const value = MARKS[(col + row * 3) % MARKS.length]
            const active = row === 3 && col === selected
            const wrong = (row * 7 + col) % 11 === 0 && flicker > 0.5
            return <div key={`${row}-${col}`} style={{ padding: 6, textAlign: 'center', borderTop: '1px solid #e2e8f0', borderLeft: '1px solid #e2e8f0',
              outline: active ? '2px solid #16a34a' : undefined, background: wrong ? '#fee2e2' : value === '?' ? '#fef3c7' : undefined }}>{value}</div>
          }),
        ])}
      </div>
    </div>
  )
}

const NOTIFS = [
  { at: 1.8, who: 'Ayşe (Şef)', text: 'Günaydın, ekip sahada.' },
  { at: 2.6, who: 'Yomra Şantiye Grubu', text: 'Kemal Bey beton saat kaçta?' },
  { at: 3.2, who: 'Yomra Şantiye Grubu', text: 'Demirciler bugün gelmedi.' },
  { at: 5.3, who: 'Musa', text: '📷 Fotoğraf' },
  { at: 6.0, who: 'Ayşe (Şef)', text: '🎤 Sesli mesaj (0:42)' },
  { at: 8.4, who: 'Mehmet (Depo)', text: '24 panel çıktı.' },
  { at: 9.2, who: 'Muhasebe', text: 'Puantajı ne zaman göndereceksiniz?' },
  { at: 10.2, who: 'Yomra Şantiye Grubu', text: '📷 2 fotoğraf' },
]

export const PhoneLock: React.FC<{ time: number }> = ({ time }) => {
  const shown = NOTIFS.filter((n) => time >= n.at).slice(-5).reverse()
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #1e293b, #0f172a)', fontFamily: FONT, padding: '40px 10px', color: '#fff' }}>
      <div style={{ textAlign: 'center', fontSize: 40, fontWeight: 300 }}>08:47</div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>Perşembe, 22 Ekim</div>
      {shown.map((n) => (
        <div key={n.at} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 14, padding: '7px 9px', marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700 }}>{n.who}</div>
          <div style={{ fontSize: 10, color: '#e2e8f0' }}>{n.text}</div>
        </div>
      ))}
    </div>
  )
}
