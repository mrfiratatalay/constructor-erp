import { detectPlatform, type Platform, type PlatformModule } from '@/core/platform'

// Dinamik import: telefon yalnızca mobil kabuğu (Vant) indirir, masaüstü kodunu hiç indirmez.
const loaders: Record<Platform, () => Promise<{ default: PlatformModule }>> = {
  mobile: () => import('@/mobile'),
  desktop: () => import('@/desktop'),
}

export async function loadPlatform(): Promise<PlatformModule> {
  const module = await loaders[detectPlatform()]()
  return module.default
}
