import 'vue-router'
import type { CurrentUserResponsePermissionsItem } from '@/core/api/generated/model'
import type { FeatureKey } from '@/core/tenant/features'

declare module 'vue-router' {
  interface RouteMeta {
    /** Oturum gerektirmez (giriş, davet, tanıtım sitesi, kurulum). */
    public?: boolean
    /** Oturum açıksa girilmez; kullanıcı ana sayfasına gönderilir (giriş sayfası). */
    guestOnly?: boolean
    /** Constructor ERP'nin tanıtım sitesi: firmanın değil ürünün markası, kendi yerleşimi. */
    marketing?: boolean
    /** Yalnızca yoklamayı alanlar görür: patron ve şef (core/team/roles: takesRollCall). */
    rollCallOnly?: boolean
    /** Yalnızca çalışan görür (Puantajım): yoklamada sayılan odur. */
    workerOnly?: boolean
    /** Yalnızca firmanın patronu görür (Firma: kimlik, logo, abonelik). */
    ownerOnly?: boolean
    /** Adresin istediği izin (Malzemeler: VIEW_MATERIALS); izni olmayan kendi ana sayfasına döner. */
    permission?: CurrentUserResponsePermissionsItem
    /** Adresin modülü: firmanın paketinde yoksa adres açılmaz, menüde görünmez. */
    feature?: FeatureKey
    /** Constructor ERP platform yönetimi: yalnızca süper yönetici. */
    platform?: boolean
    /** Çalışma alanı kilitliyken gösterilen sayfa (abonelik bitti, firma askıda). */
    lockedOnly?: boolean
    /** Oturum açıksa kullanıcı kendi ana sayfasına yönlendirilir; değilse sayfa (tanıtım) görünür. */
    resolveHome?: boolean
    /** Bir listenin içindeki detay sayfası: mobilde alt sekmeler gizlenir (WhatsApp'ta sohbetin içi gibi). */
    detail?: boolean
    title?: string
  }
}

export {}
