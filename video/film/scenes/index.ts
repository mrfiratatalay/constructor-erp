// Önizleme için sahneler (Film bunları zaman çizelgesine dizer).
import { BrandScene } from './brand/BrandScene'
import { ChaosScene } from './chaos/ChaosScene'
import { DeskTest } from './desk/DeskTest'

export const SCENES: { id: string; component: React.FC; seconds: number }[] = [
  { id: 'DeskTest', component: DeskTest, seconds: 4 },
  { id: 'Chaos', component: ChaosScene, seconds: 14.85 },
  { id: 'Brand', component: BrandScene, seconds: 9.75 },
]
