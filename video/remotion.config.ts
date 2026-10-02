// Remotion ayarları: önceden kurulu başsız Chromium kullanılır (internetten tarayıcı indirilmez), JPEG kareler.
import { Config } from '@remotion/cli/config'

Config.setBrowserExecutable(process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell')
Config.setPublicDir('public')
Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(95)
Config.setConcurrency(4)
Config.setChromiumOpenGlRenderer('swangle')
