import type { Linter } from 'eslint'

// ANAYASA.md Madde 1: boyut ve karmaşıklık sınırları. İhlal eden kod `npm run check`ten geçmez.
export const constitution: Linter.Config[] = [
  {
    name: 'anayasa/boyut',
    files: ['**/*.{vue,ts,mts,tsx}'],
    rules: {
      'max-lines': ['error', { max: 200 }],
      'max-lines-per-function': ['error', { max: 30, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 4],
      'max-depth': ['error', 3],
      complexity: ['error', 10],
    },
  },
  {
    // describe/it blokları senaryoları gruplar; test dosyasında fonksiyon sınırı anlamsızdır.
    name: 'anayasa/test-istisnasi',
    files: ['**/__tests__/**', 'e2e/**'],
    rules: { 'max-lines-per-function': 'off' },
  },
]
