import { HAND } from '../../../theme/fonts'
import { FormworkPhoto } from '../closeup/FormworkPhoto'
import { OLD_WORLD_FONT } from '../oldWorld'

const card = { borderRadius: 16, boxShadow: '0 24px 50px rgb(0 0 0 / 0.45)', overflow: 'hidden' } as const

/** Tablo parçası: kontrol edilmemiş puantaj satırları. */
export const SheetScrap = () => (
  <div style={{ ...card, width: 380, background: '#fff', fontFamily: OLD_WORLD_FONT, fontSize: 15, color: '#0f172a' }}>
    <div style={{ background: '#e5e9ef', padding: '8px 12px', fontSize: 13, color: '#475569' }}>puantaj_SON_v3 (2).xlsx</div>
    {['Ali Yılmaz', 'Murat Demir', 'Emre Kaya'].map((name, row) => (
      <div key={name} style={{ display: 'flex', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ width: 130, padding: '7px 10px' }}>{name}</div>
        {['X', row === 0 ? '½' : 'X', '?', row === 2 ? 'İ' : 'X', '-'].map((mark, index) => (
          <div key={index} style={{ width: 48, textAlign: 'center', padding: '7px 0', borderLeft: '1px solid #e2e8f0',
            background: mark === '?' ? '#fde047' : mark === '-' ? '#fee2e2' : undefined }}>{mark}</div>
        ))}
      </div>
    ))}
  </div>
)

/** Cevapsız aramalar. */
export const MissedCallScrap = () => (
  <div style={{ ...card, width: 360, background: 'rgb(22 27 38 / 0.94)', padding: '16px 18px', color: '#f8fafc',
    fontFamily: OLD_WORLD_FONT, display: 'flex', gap: 14, alignItems: 'center' }}>
    <div style={{ width: 46, height: 46, borderRadius: 23, background: '#ef4444', display: 'grid', placeItems: 'center',
      fontSize: 22 }}>✆</div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Cevapsız arama (3)</div>
      <div style={{ fontSize: 15, color: '#94a3b8' }}>Şantiye Şefi · Depo · Pompacı</div>
    </div>
  </div>
)

/** Yoklama kâğıdından kopmuş bir köşe. */
export const RosterScrap = () => (
  <div style={{ ...card, borderRadius: 4, width: 300, background: '#f3eee2', padding: '14px 20px', fontFamily: HAND,
    fontSize: 34, lineHeight: 1.15, color: '#1f3a8a' }}>
    Murat ✓ ✓ ?<br />Emre ✓ izin<br />Hasan ✗ ✓ ½
  </div>
)

/** Sohbetten bir fotoğraf. */
export const PhotoScrap = () => (
  <div style={{ ...card, width: 300, background: '#fff', padding: 6 }}>
    <FormworkPhoto width={288} height={216} />
  </div>
)

/** Pembe irsaliye köşesi. */
export const NoteScrap = () => (
  <div style={{ ...card, borderRadius: 3, width: 320, background: '#f4c6cf', padding: '14px 18px', color: '#2d3f86',
    fontFamily: HAND, fontSize: 32, lineHeight: 1.15 }}>
    <div style={{ fontFamily: OLD_WORLD_FONT, fontSize: 14, fontWeight: 700, color: '#7a2f3d' }}>SEVK İRSALİYESİ</div>
    Kalıp paneli 24 ad.<br />Teslim alan: ?
  </div>
)

/** Yapışkan not. */
export const StickyScrap = () => (
  <div style={{ ...card, borderRadius: 2, width: 230, height: 190, background: '#fde68a', padding: '20px 20px',
    fontFamily: HAND, fontSize: 36, lineHeight: 1.05, color: '#3f3a2a' }}>
    Cuma avans!!<br />Pompa 10:30?
  </div>
)

/** Okunmamış mesaj rozeti. */
export const BadgeScrap = () => (
  <div style={{ ...card, borderRadius: 40, background: '#ef4444', color: '#fff', padding: '14px 26px',
    fontFamily: OLD_WORLD_FONT, fontSize: 24, fontWeight: 700 }}>
    47 okunmamış mesaj
  </div>
)
