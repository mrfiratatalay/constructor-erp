/**
 * Canlı demo: arayüz backend'siz çalışır, istekleri tarayıcının içindeki sahte backend karşılar (core/demo/server).
 * Ücretsiz barındırmada backend uyuyor ve veritabanının süresi doluyordu; projeyi incelemek isteyen biri boş sayfa
 * görüyordu. Demo derlemesi (`--mode demo`) her zaman açılır ve hiçbir şey beklemez.
 *
 * MODE'u Vite her dosyada derleme anında sabit bir yazıyla değiştirir. Demo parçalarını yükleyen yerler (main.ts,
 * routes.ts, demo menüleri) bu karşılaştırmayı kendi içinde yapar: derleyici koşulun hep yanlış olduğunu orada görür
 * ve sahte backend, örnek veri ve fotoğraflar gerçek pakete hiç girmez.
 */
export const isDemo = import.meta.env.MODE === 'demo'

/** Demo sayfasındaki "Kaynak kod" bağlantısı. */
export const SOURCE_URL = 'https://github.com/mrfiratatalay/constructor-erp'

/** Demo hesaplarının ortak şifresi: giriş ekranına elle yazmak isteyen için. */
export const DEMO_PASSWORD = 'demo'
