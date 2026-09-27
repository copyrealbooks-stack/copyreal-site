// Copy Real direct-audio store catalogue.
// Public metadata only. Prices, payment IDs, private R2 keys and territorial
// entitlements belong in server-side configuration, never in this file.
export const AUDIO_PRODUCTS = [
  {
    slug: 'time-machine', title: 'The Time Machine', author: 'H. G. Wells',
    editions: [
      { sku: 'TM-PN', label: 'Pure Narration', enabled: false },
      { sku: 'TM-CFX', label: 'Cinematic Edition', enabled: false }
    ]
  },
  {
    slug: 'war-of-the-worlds', title: 'The War of the Worlds', author: 'H. G. Wells',
    editions: [
      { sku: 'WOTW-PN', label: 'Pure Narration', enabled: false },
      { sku: 'WOTW-CFX', label: 'Cinematic Edition', enabled: false }
    ]
  },
  {
    slug: 'lion-witch-wardrobe', title: 'The Lion, the Witch and the Wardrobe',
    author: 'C. S. Lewis', rightsReviewRequired: true,
    editions: [
      { sku: 'LWW-PN', label: 'Pure Narration', enabled: false, cover: null, sample: null },
      { sku: 'LWW-CFX', label: 'Cinematic Edition', enabled: false, cover: null, sample: null }
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
