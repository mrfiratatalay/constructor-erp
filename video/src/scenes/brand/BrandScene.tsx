import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { DESKTOP_STAGE } from '../../film/stage'
import { progress } from '../../motion/ease'
import { VIEWPORT, toVideo } from '../../ui/AppWindow'
import { useCapture, type Box } from '../../ui/useCapture'
import { AppSilhouette } from './AppSilhouette'
import { BlueprintGrid } from './BlueprintGrid'
import { GhostModules } from './GhostModules'
import { Headlines } from './Headlines'
import { LandingReveal } from './LandingReveal'
import { LogoReveal } from './LogoReveal'
import { MODULE_TARGETS } from './scaffold'
import { ScaffoldTubes } from './ScaffoldTubes'

const VIEWPORT_BOX: Box = { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height }

/**
 * 15,95 – 23,0 sn, MARKA KIRILMASI. Sessizliğin ardından blueprint ızgarası, ortada ilk dikme, kaostan kalan
 * kartlar; müziğin ilk temiz notasında kartlar iskeleye oturur. İskele uygulamanın iskeletine, oradan logoya,
 * logo da gerçek tanıtım sitesine dönüşür.
 */
export const BrandScene = () => {
  const t = useFilmTime()
  const landing = useCapture('landing', 'hero')
  const { boxes } = landing
  if (!boxes.brand) return <AbsoluteFill style={{ background: '#000' }} />
  const targets = MODULE_TARGETS.map((name) => toVideo(name === 'viewport' ? VIEWPORT_BOX : boxes[name], DESKTOP_STAGE))
  const silhouette = (1 - progress(t, cues.logo.mark - 0.1, 0.4) * 0.7) * (1 - progress(t, cues.toLanding[0], 0.4))
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: progress(t, cues.gridIn[0], cues.gridIn[1] - cues.gridIn[0]) }}>
        <BlueprintGrid drift={(t - cues.start) * -6} />
      </AbsoluteFill>
      <ScaffoldTubes opacity={1 - progress(t, cues.appSilhouette[0], 0.6)} />
      <GhostModules targets={targets} opacity={silhouette} />
      <AppSilhouette opacity={silhouette} />
      <Headlines />
      <LandingReveal src={landing.src} />
      <LogoReveal header={toVideo(boxes.brand, DESKTOP_STAGE)} />
    </AbsoluteFill>
  )
}
