import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
import { architecture } from './eslint/architecture'
import { constitution } from './eslint/constitution'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  // components.d.ts otomatik üretilir; elle yazılmayan dosya anayasaya tabi değildir.
  globalIgnores(['**/dist/**', '**/coverage/**', 'src/app/components.d.ts']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.ts'],
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...constitution,
  ...architecture,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting,
)
