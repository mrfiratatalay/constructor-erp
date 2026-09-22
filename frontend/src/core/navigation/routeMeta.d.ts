import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Oturum gerektirmez (giriş, davet). */
    public?: boolean
    /** Oturum açıksa girilmez; kullanıcı ana sayfasına gönderilir (giriş sayfası). */
    guestOnly?: boolean
    /** Yalnızca patron görür. */
    ownerOnly?: boolean
    /** Adres gösterilmez; kullanıcı rolüne göre kendi ana sayfasına yönlendirilir. */
    resolveHome?: boolean
    title?: string
  }
}

export {}
