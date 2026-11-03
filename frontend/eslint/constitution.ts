import type { Linter } from 'eslint'

// Kod kuralları (docs/07-kod-kalitesi.md): boyut ve karmaşıklık sınırları. İhlal eden kod `npm run check`ten geçmez.
export const constitution: Linter.Config[] = [
  {
    name: 'kurallar/boyut',
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
    name: 'kurallar/test-istisnasi',
    files: ['**/__tests__/**', 'e2e/**'],
    rules: { 'max-lines-per-function': 'off' },
  },
]
