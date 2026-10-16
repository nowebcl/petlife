const fs = require('fs');
const path = require('path');

const POCKETBASE_URL = process.env.VITE_POCKETBASE_URL || 'https://petlife.noweb.cl';

async function main() {
  const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records?perPage=200&sort=-created,-id`);
  if (!res.ok) {
    throw new Error(`Error al conectar con PocketBase: HTTP ${res.status}`);
  }
  const pbData = await res.json();
  const pbItems = pbData.items || [];

  const rootDir = path.resolve(__dirname, '..');
  const tsPath = path.join(rootDir, 'src/data/products.ts');
  const tsContent = fs.readFileSync(tsPath, 'utf8');
  const marker = 'export const PRODUCTS_DATABASE: Product[] = ';
  const endMarker = 'export const ALL_CATEGORIES';
  const arrayStart = tsContent.indexOf(marker) + marker.length;
  const arrayEnd = tsContent.indexOf(endMarker);
  const jsonStr = tsContent.slice(arrayStart, arrayEnd).trim().replace(/;$/, '');
  const localProducts = JSON.parse(jsonStr);

  const localBySku = new Map(localProducts.map(p => [p.sku, p]));

  // Descargar imágenes .webp actualizadas desde PocketBase a public/productos/
  for (const pb of pbItems) {
    if (pb.image && pb.image.toLowerCase().endsWith('.webp')) {
      const pbFileUrl = `${POCKETBASE_URL}/api/files/${pb.collectionId}/${pb.id}/${pb.image}`;
      const loc = localBySku.get(pb.sku);
      if (loc && loc.imageUrl && loc.imageUrl.startsWith('/productos/')) {
        const localFilePath = path.join(rootDir, 'public', loc.imageUrl);
        console.log(`Descargando imagen actualizada de PocketBase [${pb.sku}] ${pb.name} -> ${loc.imageUrl}`);
        const imgRes = await fetch(pbFileUrl);
        if (imgRes.ok) {
          let buf = Buffer.from(await imgRes.arrayBuffer());
          try {
            const sharp = require('sharp');
            if (buf.length > 40 * 1024) {
              buf = await sharp(buf)
                .resize({ width: 450, height: 450, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80, effort: 5 })
                .toBuffer();
              console.log(`  ↳ Comprimido con Sharp: ${(buf.length / 1024).toFixed(1)} KB`);
            }
          } catch {}
          fs.writeFileSync(localFilePath, buf);
        }
      }
    }
  }

  const syncedProducts = [];
  for (const pb of pbItems) {
    if (pb.name.toLowerCase() === 'producto de prueba') {
      continue;
    }
    const existing = localBySku.get(pb.sku) || {};
    let benefits = existing.benefits || ['Excelente calidad garantizada', 'Nutrición óptima'];
    if (Array.isArray(pb.benefits) && pb.benefits.length > 0) {
      benefits = pb.benefits;
    } else if (typeof pb.benefits === 'string' && pb.benefits.trim()) {
      try {
        benefits = JSON.parse(pb.benefits);
      } catch {}
    }

    let imageUrl = existing.imageUrl || `/productos/${pb.name}.webp`;
    if (pb.imageUrl && pb.imageUrl.startsWith('/productos/')) {
      imageUrl = pb.imageUrl.replace(/\.(jpeg|jpg|png)$/i, '.webp');
    } else if (pb.image && pb.image.toLowerCase().endsWith('.webp') && !existing.imageUrl) {
      imageUrl = `${POCKETBASE_URL}/api/files/${pb.collectionId}/${pb.id}/${pb.image}`;
    }

    let variants = existing.variants;
    if (Array.isArray(variants) && variants.length > 0) {
      variants = variants.map((v, idx) => {
        if (idx === variants.length - 1) {
          return {
            ...v,
            label: `${v.label.split(' ')[0] || 'Saco'} ${pb.weightOrSize || v.weightOrSize}`,
            weightOrSize: pb.weightOrSize || v.weightOrSize,
            price: Number(pb.price) || v.price,
            inStock: pb.inStock !== false && Number(pb.stockCount) > 0,
          };
        }
        return v;
      });
    }

    syncedProducts.push({
      id: pb.id,
      name: pb.name,
      brand: pb.brand || existing.brand || '',
      category: pb.category || existing.category || 'perros',
      categoryLabel: pb.categoryLabel || existing.categoryLabel || 'Alimentos Perros',
      petType: pb.petType || existing.petType || 'perro',
      lifeStage: pb.lifeStage || existing.lifeStage || 'adulto',
      price: Number(pb.price) || 0,
      rating: Number(pb.rating) || existing.rating || 4.8,
      reviewsCount: Number(pb.reviewsCount) || existing.reviewsCount || 50,
      featured: Boolean(pb.featured),
      weightOrSize: pb.weightOrSize || existing.weightOrSize || '',
      icon: existing.icon || (pb.petType === 'gato' || pb.category === 'gatos' ? '🐱' : '🐕'),
      bgGradient:
        existing.bgGradient ||
        (pb.category === 'gatos'
          ? 'from-purple-500/10 to-pink-500/10 text-purple-600'
          : pb.category === 'higiene'
          ? 'from-cyan-500/10 to-blue-500/10 text-cyan-600'
          : 'from-amber-500/10 to-orange-500/10 text-orange-600'),
      description: pb.description || existing.description || '',
      longDescription: pb.longDescription || existing.longDescription || pb.description || '',
      imageUrl,
      galleryImages: [imageUrl],
      inStock: pb.inStock !== false && Number(pb.stockCount) > 0,
      stockCount: Number(pb.stockCount) || 0,
      sku: pb.sku,
      ...(variants ? { variants } : {}),
      benefits,
      ...(existing.ingredients ? { ingredients: existing.ingredients } : {}),
      ...(existing.nutritionalAnalysis ? { nutritionalAnalysis: existing.nutritionalAnalysis } : {}),
      ...(existing.feedingGuide ? { feedingGuide: existing.feedingGuide } : {}),
      ...(existing.reviews ? { reviews: existing.reviews } : {}),
    });
  }

  const featuredIds = syncedProducts.filter(p => p.featured).map(p => p.id);

  const headerPart = tsContent.slice(0, tsContent.indexOf(marker) + marker.length);
  const footerPart = `

export const ALL_CATEGORIES = [
  { id: 'todos', label: 'Todos los productos', count: PRODUCTS_DATABASE.length },
  { id: 'perros', label: 'Alimentos Perros', count: PRODUCTS_DATABASE.filter(p => p.category === 'perros').length },
  { id: 'gatos', label: 'Alimentos Gatos', count: PRODUCTS_DATABASE.filter(p => p.category === 'gatos').length },
  { id: 'higiene', label: 'Arenas & Higiene', count: PRODUCTS_DATABASE.filter(p => p.category === 'higiene').length },
  { id: 'snacks', label: 'Pequeñas Mascotas & Snacks', count: PRODUCTS_DATABASE.filter(p => p.category === 'snacks').length },
];

export const FEATURED_PRODUCT_IDS: string[] = ${JSON.stringify(featuredIds, null, 2)};

export const FEATURED_PRODUCTS: Product[] = FEATURED_PRODUCT_IDS
  .map(id => PRODUCTS_DATABASE.find(p => p.id === id))
  .filter((p): p is Product => Boolean(p));
`;

  const newTsContent = headerPart + JSON.stringify(syncedProducts, null, 2) + ';' + footerPart;
  fs.writeFileSync(tsPath, newTsContent, 'utf8');
  console.log(`Sincronizados ${syncedProducts.length} productos (${featuredIds.length} destacados) desde PocketBase a src/data/products.ts`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
