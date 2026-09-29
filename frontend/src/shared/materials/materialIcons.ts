import type { Component } from 'vue'
import {
  ArrowRightLeft,
  ArrowUpRight,
  BrickWall,
  Building2,
  Cable,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock3,
  ClipboardList,
  Cylinder,
  Grid3x3,
  Layers,
  Mountain,
  Package,
  PackagePlus,
  PaintBucket,
  RotateCcw,
  Truck,
  Undo2,
  Warehouse,
  Wrench,
} from 'lucide-vue-next'
import type { LocationViewKind } from '@/core/api/generated/model'
import type { MovementStatus, MovementType } from '@/core/materials/materialLabels'

/** Hareket türünün simgesi: kamyon gönderim, anahtar kullanım, dışarı ok, çift ok transfer, kutu geliş, geri iade. */
export const TYPE_ICONS: Record<MovementType, Component> = {
  TO_SITE: Truck,
  USED: Wrench,
  OUTBOUND: ArrowUpRight,
  TRANSFER: ArrowRightLeft,
  INBOUND: PackagePlus,
  RETURN: Undo2,
  ADJUSTMENT: ClipboardList,
}

/** Durumun simgesi: tamam ✓, bekliyor saat, dikkat !, geri dönüş ↺, iptal ✕. Anlam yalnızca renge kalmaz. */
export const STATUS_ICONS: Record<MovementStatus, Component> = {
  PENDING_CHECK: CircleAlert,
  IN_TRANSIT: Clock3,
  DELIVERED: CircleCheck,
  COMPLETED: CircleCheck,
  AWAITING_RETURN: RotateCcw,
  PARTIALLY_RETURNED: RotateCcw,
  RETURNED: CircleCheck,
  CANCELLED: CircleX,
}

export const LOCATION_ICONS: Record<LocationViewKind, Component> = {
  DEPOT: Warehouse,
  SITE: Building2,
}

/** Malzemenin simgesi adından tahmin edilir (kablo, boru, tuğla…); tanınmayan malzeme kutudur. */
const MATERIAL_ICONS: [RegExp, Component][] = [
  [/kablo/i, Cable],
  [/boru|pvc|hortum/i, Cylinder],
  [/tuğla|briket|bims/i, BrickWall],
  [/seramik|fayans|karo|mermer|levha/i, Grid3x3],
  [/kum|çakıl|mıcır|toprak/i, Mountain],
  [/boya|astar/i, PaintBucket],
  [/demir|çelik|kalıp|profil|kereste/i, Layers],
]

export function materialIcon(name: string): Component {
  return MATERIAL_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? Package
}
