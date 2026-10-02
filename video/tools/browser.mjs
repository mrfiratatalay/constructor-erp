// Önceden kurulu Chromium; WebGL yazılımla (SwiftShader) çalışır: GPU olmayan makinede de aynı görüntü.
import { chromium } from 'playwright-core'

export const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium'

export function launch(options = {}) {
  return chromium.launch({
    executablePath: CHROMIUM,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--font-render-hinting=none', '--disable-smooth-scrolling', '--hide-scrollbars'],
    ...options,
  })
}
