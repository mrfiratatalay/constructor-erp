import waybill from './irsaliye-ornek.pdf'

/** Örnek irsaliye: tek sayfalık, demo için üretilmiş bir PDF. Sevkiyat belgelerinde ve sohbetteki belgelerde kullanılır. */
export const SAMPLE_WAYBILL = {
  url: waybill,
  contentType: 'application/pdf',
  sizeBytes: 1117,
} as const
