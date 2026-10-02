import { Layer } from '../../../motion/Camera'
import { DeskPhone } from '../props/DeskPhone'
import { DeskProps } from '../props/DeskProps'
import { Laptop } from '../props/Laptop'
import { DustMotes, LightRays, SunBloom } from './Atmosphere'
import { BossSilhouette } from './BossSilhouette'
import { Desk } from './Desk'
import { OfficeWall } from './OfficeWall'
import { SiteBuilding } from './SiteBuilding'
import { SiteGround } from './SiteGround'
import { Sky } from './Sky'
import { TowerCrane } from './TowerCrane'

/**
 * Şantiye ofisinin geniş planı, derinlik sırasıyla: gökyüzü, vinç, bina, çit, duvar ve pencere, ışık, masa,
 * nesneler, toz, önde patron. Uzak katmanlar hafif bulanık (alan derinliği), patron daha da bulanık.
 */
/** calm: kapanıştaki aynı ofis, karmaşa yok (laptopta İskele ERP, masada yalnızca gerekenler, saat 17:20). */
export const WideWorld = ({ calm = false }: { calm?: boolean }) => (
  <>
    <Layer depth={0.12} blur={1.6}>
      <Sky />
    </Layer>
    <Layer depth={0.2} blur={1.2}>
      <TowerCrane />
    </Layer>
    <Layer depth={0.22} blur={1}>
      <SiteBuilding />
    </Layer>
    <Layer depth={0.26} blur={1.4}>
      <SiteGround />
    </Layer>
    <Layer depth={0.22}>
      <SunBloom />
    </Layer>
    <Layer depth={0.55}>
      <OfficeWall calm={calm} />
    </Layer>
    <Layer depth={0.6}>
      <LightRays />
    </Layer>
    <Layer depth={0.85}>
      <Desk />
    </Layer>
    <Layer depth={0.9}>
      <Laptop calm={calm} />
      <DeskProps calm={calm} />
      <DeskPhone />
    </Layer>
    <Layer depth={0.95}>
      <DustMotes />
    </Layer>
    <Layer depth={1.3} blur={5}>
      <BossSilhouette calm={calm} />
    </Layer>
  </>
)
