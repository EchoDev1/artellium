/**
 * Category Normalization & Intelligent Matching Utilities
 * Ensures seamless matching between artist uploaded categories (e.g. 'Paintings', 'Sculptures', 'Woodworks')
 * and storefront category bars/filters (e.g. 'Painters', 'Sculpture Makers', 'Digital Art', 'Mixed Media', etc.)
 */

export function normalizeCategory(cat) {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().trim();
  if (c === 'all') return 'all';
  if (c.includes('paint') || c.includes('oil') || c.includes('acrylic') || c.includes('canvas')) return 'paintings';
  if (c.includes('sculpt') || c.includes('bronze') || c.includes('cast')) return 'sculptures';
  if (c.includes('draw') || c.includes('sketch') || c.includes('charcoal') || c.includes('ink') || c.includes('graphite')) return 'drawings';
  if (c.includes('photo')) return 'photography';
  if (c.includes('textil') || c.includes('adire') || c.includes('batik') || c.includes('woven') || c.includes('fiber') || c.includes('tapestry')) return 'textiles';
  if (c.includes('potter') || c.includes('clay') || c.includes('terracotta')) return 'pottery';
  if (c.includes('ceramic') || c.includes('stoneware') || c.includes('glaze')) return 'ceramics';
  if (c.includes('wood') || c.includes('mahogany') || c.includes('iroko') || c.includes('carv')) return 'woodworks';
  if (c.includes('metal') || c.includes('iron') || c.includes('brass') || c.includes('copper')) return 'metal_works';
  if (c.includes('craft') || c.includes('handmade') || c.includes('bead') || c.includes('leather')) return 'crafts';
  if (c.includes('indigenous') || c.includes('ancestral') || c.includes('sacred') || c.includes('heritage') || c.includes('folklore')) return 'indigenous';
  if (c.includes('digit') || c.includes('afrofutur') || c.includes('3d') || c.includes('render') || c.includes('giclée') || c.includes('limited')) return 'digital_art';
  if (c.includes('mixed')) return 'mixed_media';
  return c;
}

export function isCategoryMatch(artCategory, targetCategory, artMedium = '', artTitle = '') {
  if (!targetCategory || targetCategory === 'All' || targetCategory === 'all' || targetCategory === '') return true;
  
  const normTarget = normalizeCategory(targetCategory);
  const normArt = normalizeCategory(artCategory);
  
  if (normTarget === 'all') return true;
  if (normArt === normTarget) return true;

  const rawTarget = String(targetCategory).toLowerCase().trim();
  const rawArt = String(artCategory || '').toLowerCase().trim();
  const rawMed = String(artMedium || '').toLowerCase().trim();
  const rawTitle = String(artTitle || '').toLowerCase().trim();

  // Substring check
  if (rawArt.includes(rawTarget) || rawTarget.includes(rawArt)) return true;
  if (rawMed.includes(rawTarget)) return true;

  // Semantic category cross-matching
  if (normTarget === 'paintings' && (rawArt.includes('paint') || rawMed.includes('paint') || rawMed.includes('oil') || rawMed.includes('acrylic') || rawMed.includes('canvas'))) return true;
  if (normTarget === 'sculptures' && (rawArt.includes('sculpt') || rawMed.includes('bronze') || rawMed.includes('wood') || rawMed.includes('bust') || rawMed.includes('cast') || rawMed.includes('statue'))) return true;
  if (normTarget === 'drawings' && (rawArt.includes('draw') || rawMed.includes('charcoal') || rawMed.includes('ink') || rawMed.includes('sketch') || rawMed.includes('graphite') || rawMed.includes('paper'))) return true;
  if (normTarget === 'photography' && (rawArt.includes('photo') || rawMed.includes('photo') || rawMed.includes('print'))) return true;
  if (normTarget === 'textiles' && (rawArt.includes('textil') || rawMed.includes('textil') || rawMed.includes('fiber') || rawMed.includes('adire') || rawMed.includes('batik') || rawMed.includes('woven') || rawMed.includes('cloth'))) return true;
  if (normTarget === 'pottery' && (rawArt.includes('potter') || rawMed.includes('clay') || rawMed.includes('terracotta') || rawMed.includes('kiln') || rawMed.includes('vessel'))) return true;
  if (normTarget === 'ceramics' && (rawArt.includes('ceramic') || rawMed.includes('ceramic') || rawMed.includes('stoneware') || rawMed.includes('glaze'))) return true;
  if (normTarget === 'woodworks' && (rawArt.includes('wood') || rawMed.includes('wood') || rawMed.includes('mahogany') || rawMed.includes('iroko') || rawMed.includes('mask') || rawMed.includes('carv'))) return true;
  if (normTarget === 'metal_works' && (rawArt.includes('metal') || rawMed.includes('metal') || rawMed.includes('iron') || rawMed.includes('brass') || rawMed.includes('bronze') || rawMed.includes('copper') || rawMed.includes('foundry'))) return true;
  if (normTarget === 'crafts' && (rawArt.includes('craft') || rawMed.includes('bead') || rawMed.includes('leather') || rawMed.includes('artisanal') || rawMed.includes('handmade'))) return true;
  if (normTarget === 'indigenous' && (rawArt.includes('indigenous') || rawMed.includes('ancestral') || rawMed.includes('sacred') || rawMed.includes('heritage') || rawMed.includes('ritual') || rawMed.includes('yoruba') || rawMed.includes('benin'))) return true;
  if (normTarget === 'digital_art' && (rawArt.includes('digit') || rawArt.includes('limited') || rawMed.includes('digit') || rawMed.includes('render') || rawMed.includes('3d') || rawMed.includes('giclée') || rawMed.includes('edition') || rawMed.includes('generative'))) return true;
  if (normTarget === 'mixed_media' && (rawArt.includes('mixed') || rawMed.includes('mixed') || rawMed.includes('pigment') || rawMed.includes('indigo') || rawMed.includes('collage'))) return true;

  return false;
}
