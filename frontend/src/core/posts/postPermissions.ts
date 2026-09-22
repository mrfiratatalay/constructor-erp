import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'

/** Düzeltme yalnızca yazarın: başkasının ağzından yazılmaz (patron da düzeltemez, silebilir). */
export function canCorrect(post: PostView, user: CurrentUserResponse | undefined): boolean {
  return !!user && !post.deletion && post.author.id === user.id
}

/** Silme: yazar kendi gönderisini, patron her gönderiyi. Yerinde "silindi" izi kalır. */
export function canDelete(post: PostView, user: CurrentUserResponse | undefined): boolean {
  return !!user && !post.deletion && (post.author.id === user.id || user.role === 'OWNER')
}

/** Çözülmüş sorunun "sorun" işareti değişmez: kaydı geçmişe dönük bozulmasın. */
export function canChangeIssueFlag(post: PostView): boolean {
  return !post.resolution
}
