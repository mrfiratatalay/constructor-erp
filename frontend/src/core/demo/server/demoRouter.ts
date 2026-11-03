import type { DemoRequest } from './demoRequest'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type Handler = (request: DemoRequest) => unknown

/** Bir uç: yöntem, backend'deki adresle aynı kalıp ('/api/sites/:siteId') ve cevabı üreten fonksiyon. */
export interface DemoRoute {
  method: Method
  path: string
  handler: Handler
}

export const get = (path: string, handler: Handler): DemoRoute => ({ method: 'GET', path, handler })
export const post = (path: string, handler: Handler): DemoRoute => ({ method: 'POST', path, handler })
export const put = (path: string, handler: Handler): DemoRoute => ({ method: 'PUT', path, handler })
export const patch = (path: string, handler: Handler): DemoRoute => ({ method: 'PATCH', path, handler })
export const del = (path: string, handler: Handler): DemoRoute => ({ method: 'DELETE', path, handler })

interface CompiledRoute {
  route: DemoRoute
  pattern: RegExp
  names: string[]
}

function compile(route: DemoRoute): CompiledRoute {
  const names: string[] = []
  const source = route.path.replace(/:([A-Za-z]+)/g, (_, name: string) => {
    names.push(name)
    return '([^/]+)'
  })
  return { route, pattern: new RegExp(`^${source}$`), names }
}

export interface RouteMatch {
  handler: Handler
  params: Record<string, string>
}

/**
 * Adres eşleştirici. Sabit adres, parametreli adresten önce denenir: '/api/posts/search' bir gönderi kimliği
 * ('/api/posts/:postId') sanılmasın.
 */
export function createRouter(routes: DemoRoute[]) {
  const compiled = routes.map(compile).sort((a, b) => a.names.length - b.names.length)
  return (method: string, path: string): RouteMatch | undefined => {
    for (const { route, pattern, names } of compiled) {
      const match = route.method === method ? pattern.exec(path) : null
      if (!match) continue
      const params = Object.fromEntries(names.map((name, index) => [name, decodeURIComponent(match[index + 1]!)]))
      return { handler: route.handler, params }
    }
    return undefined
  }
}
