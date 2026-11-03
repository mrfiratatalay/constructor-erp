/** Demo sayfasındaki rol kartı: kim olarak girilecek, o rol ne yapar, ilk neye bakmalı. */
export interface DemoRole {
  key: 'owner' | 'lead' | 'warehouse' | 'worker' | 'admin'
  title: string
  person: string
  email: string
  summary: string
  tryThis: string[]
}

/**
 * Projeyi inceleyen kişi hangi rolle neye bakacağını bilmez; her kart bir cümleyle rolü anlatır ve üç şey önerir.
 * Hesaplar örnek veridendir (core/demo/server/seed), hepsi aynı demo şifresiyle girer.
 */
export const DEMO_ROLES: DemoRole[] = [
  {
    key: 'owner',
    title: 'Patron',
    person: 'Kemal Atalay',
    email: 'kemal@atalayyapi.test',
    summary: 'Firmanın sahibi. Bütün şantiyeleri, yoklamayı, malzemeyi ve firmanın aboneliğini görür.',
    tryThis: ['Şantiyeler: okunmamış mesajlar ve açık sorun', 'Yoklama → Puantaj: ayın cetveli', 'Firma: abonelik ve kişiler'],
  },
  {
    key: 'lead',
    title: 'Şantiye şefi',
    person: 'Ayşe Kara',
    email: 'ayse@atalayyapi.test',
    summary: 'Sahadaki yönetici. Her sabah yoklama alır, günlük ilerlemeyi girer.',
    tryThis: ['Yoklama: bugünü işaretle', 'Yomra Park → İlerleme: günlük giriş yap', 'Saha sekmesine fotoğraf at'],
  },
  {
    key: 'warehouse',
    title: 'Depo sorumlusu',
    person: 'Mehmet Şahin',
    email: 'mehmet@atalayyapi.test',
    summary: 'Malzemeyi depodan şantiyelere gönderir, gelen ve dönen kamyonları kaydeder.',
    tryThis: ['Malzemeler: yeni sevkiyat kaydı', 'Bir sevkiyata irsaliye ekle', 'Sevkiyat girerken depodaki stoğu gör'],
  },
  {
    key: 'worker',
    title: 'Çalışan',
    person: 'Musa Aydın',
    email: 'musa@atalayyapi.test',
    summary: 'Sahada çalışır, uygulamayı WhatsApp gibi kullanır. Firmaya patronun bağlantısıyla katılmıştır.',
    tryThis: ['Bir şantiyeye fotoğraf ya da mesaj at', 'Sorun bildir', 'Puantajım: kendi ayını gör'],
  },
  {
    key: 'admin',
    title: 'Platform yöneticisi',
    person: 'Fırat Atalay',
    email: 'admin@constructor-erp.test',
    summary: 'Constructor ERP ekibi: ürünü satan, firmaları ve abonelikleri yöneten taraf.',
    tryThis: ['Özet: tahsilat ve yakında bitecek abonelikler', 'Firmalar: yeni firma aç, kurulum linki üret', 'Başvurular ve paketler'],
  },
]

/** Bekleyen kurulum linki: satın alan bir firmanın kendi hesabını kurduğu sihirbaz (örnek veride hazır). */
export const DEMO_SETUP_PATH = '/kurulum/demo-kurulum'
