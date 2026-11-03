import type { MemberViewRole, WorkspaceViewPermissionsItem } from '@/core/api/generated/model'
import { forbidden } from '@/core/demo/server/demoError'
import { requireMember, type Member } from '@/core/demo/server/demoSession'
import { featuresOf } from '@/core/demo/server/platform/subscriptions'

type Permission = WorkspaceViewPermissionsItem

/** Her izin bir modüle aittir: paketinde o modül olmayan firmada izin de yoktur (backend'deki Permission.java). */
const FEATURE_OF: Record<Permission, string> = {
  VIEW_MATERIALS: 'materials',
  CREATE_MATERIAL_MOVEMENT: 'materials',
  UPDATE_MATERIAL_MOVEMENT: 'materials',
  CANCEL_MATERIAL_MOVEMENT: 'materials',
  MANAGE_MATERIAL_CATALOG: 'materials',
  EXPORT_MATERIALS: 'materials',
  VIEW_PRODUCTION: 'production',
  MANAGE_PRODUCTION: 'production',
}

const ALL = Object.keys(FEATURE_OF) as Permission[]

/**
 * Patron ve depo sorumlusu her şeyi görür, ilerlemeyi girmez. Şef sevkiyat çıkarır, malzeme kartı açar, ilerlemeyi
 * yalnızca o girer; iptal ve düzeltme depo ile patronundur. Çalışanın izni yoktur.
 */
const GRANTED: Record<MemberViewRole, Permission[]> = {
  OWNER: ALL.filter((permission) => permission !== 'MANAGE_PRODUCTION'),
  WAREHOUSE: ALL.filter((permission) => permission !== 'MANAGE_PRODUCTION'),
  SITE_LEAD: [
    'VIEW_MATERIALS',
    'CREATE_MATERIAL_MOVEMENT',
    'MANAGE_MATERIAL_CATALOG',
    'EXPORT_MATERIALS',
    'VIEW_PRODUCTION',
    'MANAGE_PRODUCTION',
  ],
  WORKER: [],
}

export function permissionsOf(role: MemberViewRole, features: string[]): Permission[] {
  return GRANTED[role].filter((permission) => features.includes(FEATURE_OF[permission]))
}

/** Uç bu izni ister (backend'deki @PreAuthorize): yoksa 403. */
export function requirePermission(permission: Permission): Member {
  const member = requireMember()
  if (!permissionsOf(member.role, featuresOf(member.company)).includes(permission)) throw forbidden()
  return member
}
