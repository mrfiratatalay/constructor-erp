/**
 * Vant hücresi özel ikonla (avatar, işaret dairesi) başlık arasına boşluk koymaz; yalnızca kendi ikonuna koyar.
 * Boşluk hücrenin kendi seçeneğiyle, başlığın `title-style`ı ile verilir; elle CSS yazılmaz. Başlığın altındaki
 * gri satır (label) da başlıkla birlikte kayar, ikisi aynı hizada kalır.
 */
export const ICON_TITLE_GAP = { marginLeft: 'var(--space-3)' } as const
