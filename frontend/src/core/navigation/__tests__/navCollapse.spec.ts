import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, type EffectScope } from 'vue'
import { useNavCollapse } from '@/core/navigation/navCollapse'

type Listener = (event: MediaQueryListEvent) => void

/** Pencere genişliğinin yerine geçer: dar mı geniş mi, testin söylediği olur. */
function fakeWindow(compact: boolean) {
  const listeners = new Set<Listener>()
  const list = {
    matches: compact,
    addEventListener: (_: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_: string, listener: Listener) => listeners.delete(listener),
  }
  vi.stubGlobal('matchMedia', () => list)
  return {
    resize(nextCompact: boolean) {
      list.matches = nextCompact
      listeners.forEach((listener) => listener({ matches: nextCompact } as MediaQueryListEvent))
    },
  }
}

const scopes: EffectScope[] = []

function mountNav() {
  const scope = effectScope()
  scopes.push(scope)
  return scope.run(() => useNavCollapse())!
}

describe('useNavCollapse', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    scopes.splice(0).forEach((scope) => scope.stop())
    vi.unstubAllGlobals()
  })

  it('geniş pencerede daraltma tercihi kaydedilir ve bir sonraki açılışta hatırlanır', async () => {
    fakeWindow(false)
    const nav = mountNav()
    expect(nav.collapsed.value).toBe(false)

    nav.toggle()
    await nextTick()
    expect(nav.collapsed.value).toBe(true)
    expect(mountNav().collapsed.value).toBe(true)
  })

  it('dar pencerede menü kendiliğinden daralır; açmak geçicidir, tercihi değiştirmez', async () => {
    fakeWindow(true)
    const nav = mountNav()
    expect(nav.collapsed.value).toBe(true)

    nav.toggle()
    await nextTick()
    expect(nav.collapsed.value).toBe(false)
    expect(localStorage.getItem('santiye.navCollapsed')).toBeNull()
  })

  it('pencere genişleyince kayıtlı tercihe döner, yeniden daralınca geçici açma unutulur', async () => {
    const browserWindow = fakeWindow(true)
    const nav = mountNav()
    nav.toggle()

    browserWindow.resize(false)
    await nextTick()
    expect(nav.collapsed.value).toBe(false)

    browserWindow.resize(true)
    await nextTick()
    expect(nav.collapsed.value).toBe(true)
  })
})
