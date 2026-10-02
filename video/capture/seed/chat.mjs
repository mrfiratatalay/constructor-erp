// Yomra Park'ın sohbeti ve saha günlüğü: dün akşamdan bu sabaha, kim ne paylaştıysa.
import { post } from './team.mjs'

const today = (time) => `2026-10-02 ${time}:00+03`
const yesterday = (time) => `2026-10-01 ${time}:00+03`

export const seedChat = async (team, patron, siteId, media) => {
  const { ayse, mehmet, musa } = team
  const script = [
    [ayse, { body: 'Yarın 3. kat döşeme demiri bağlanacak, ekip 7:30’da sahada.', at: yesterday('17:42') }],
    [mehmet, { body: 'Kalıp panelleri depoda hazır, sabah ilk araçla gönderiyorum.', at: yesterday('18:05') }],
    [patron, { body: 'Tamam. Pompa firmasıyla da konuştum.', at: yesterday('18:21') }],
    [ayse, { body: 'Beton pompasının geliş saati bekleniyor.', field: true, issue: true, at: today('09:40') }],
    [ayse, { file: media.voice, at: today('10:12') }],
    [mehmet, { body: 'İnşaat demiri şantiyeye teslim edildi.', field: true, file: media.photos.rebar, at: today('11:05') }],
    [musa, { body: 'Demirler 2. kata çekildi 👍', at: today('11:20') }],
    [ayse, { body: 'Pompa geldi, döküm 13:30’da.', file: media.photos.pump, at: today('12:48') }],
  ]
  for (const [author, message] of script) {
    const context = author.context ?? author
    await post(context, siteId, message)
  }
}
