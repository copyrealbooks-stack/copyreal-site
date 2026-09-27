// Copy Real direct-audio store catalogue.
// Keep payment IDs and private Drive file IDs out of this public repository.
// Runtime bindings map each sku to payment-provider and delivery records.

export const AUDIO_PRODUCTS = [
  {
    slug: 'time-machine',
    title: 'The Time Machine',
    author: 'H. G. Wells',
    editions: [
      { sku: 'TM-PN', label: 'Pure Narration', enabled: false },
      { sku: 'TM-CFX', label: 'Cinematic Edition', enabled: false }
    ]
  },
  {
    slug: 'war-of-the-worlds',
    title: 'The War of the Worlds',
    author: 'H. G. Wells',
    editions: [
      { sku: 'WOTW-PN', label: 'Pure Narration', enabled: false },
      { sku: 'WOTW-CFX', label: 'Cinematic Edition', enabled: false }
    ]
  }
];

export function findEdition(sku) {
  for (const product of AUDIO_PRODUCTS) {
    const edition = product.editions.find(item => item.sku === sku);
    if (edition) return { ...edition, product };
  }
  return null;
}
