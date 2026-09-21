import type { Linter } from 'eslint'

// ANAYASA.md Madde 4: katman ve platform sınırlarını import seviyesinde denetler.
const VANT = ['vant', 'vant/*', '@vant/*']
const ELEMENT_PLUS = ['element-plus', 'element-plus/*', '@element-plus/*']
const LAYERS = ['atoms', 'molecules', 'organisms', 'templates', 'pages']
const ROUTER_TAGS = ['RouterView', 'RouterLink']

interface Zone {
  dir: string
  forbiddenImports: string[]
  /** Şablonda import edilmeden kullanılabilecek kütüphane etiketleri (otomatik import). */
  libraryTags: string[]
}

const ZONES: Zone[] = [
  {
    dir: 'core',
    forbiddenImports: [...VANT, ...ELEMENT_PLUS, '*.vue', '@/app/*', '@/shared/*', '@/mobile/*', '@/desktop/*'],
    libraryTags: [],
  },
  {
    dir: 'shared',
    forbiddenImports: [...VANT, ...ELEMENT_PLUS, '@/app/*', '@/mobile/*', '@/desktop/*'],
    libraryTags: [],
  },
  { dir: 'mobile', forbiddenImports: [...ELEMENT_PLUS, '@/app/*', '@/desktop/*'], libraryTags: ['^van-'] },
  { dir: 'desktop', forbiddenImports: [...VANT, '@/app/*', '@/mobile/*'], libraryTags: ['^el-'] },
]

function restrictImports(forbidden: string[]): Linter.RuleEntry {
  return [
    'error',
    {
      patterns: [
        { group: forbidden, message: 'Mimari sınır ihlali: ANAYASA.md Madde 4.' },
        { group: ['../*'], message: 'Klasör dışına import @/ ile yazılır: ANAYASA.md Madde 4.' },
      ],
    },
  ]
}

/** Bir katman yalnızca kendinden alttakileri import edebilir: üsttekiler yasaklanır. */
function higherLayersOf(layer: string): string[] {
  return LAYERS.slice(LAYERS.indexOf(layer) + 1).map((higher) => `@/*/${higher}/*`)
}

function zoneConfigs(zone: Zone): Linter.Config[] {
  const zoneWide: Linter.Config = {
    name: `mimari/${zone.dir}`,
    files: [`src/${zone.dir}/**/*.{ts,vue}`],
    rules: {
      'no-restricted-imports': restrictImports(zone.forbiddenImports),
      'vue/no-undef-components': ['error', { ignorePatterns: [...zone.libraryTags, ...ROUTER_TAGS] }],
    },
  }
  // Katman kuralı bölge kuralını ezer; bu yüzden bölgenin yasakları da listeye eklenir.
  const perLayer = LAYERS.map((layer) => ({
    name: `mimari/${zone.dir}/${layer}`,
    files: [`src/${zone.dir}/${layer}/**/*.{ts,vue}`],
    rules: {
      'no-restricted-imports': restrictImports([...zone.forbiddenImports, ...higherLayersOf(layer)]),
    },
  }))
  return [zoneWide, ...perLayer]
}

export const architecture: Linter.Config[] = ZONES.flatMap(zoneConfigs)
