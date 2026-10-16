const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeAll() {
  console.log('🚀 Starting high-performance asset optimization with Sharp...\n');
  let totalOriginal = 0;
  let totalOptimized = 0;

  // 1. Optimize public/productos
  const productosDir = path.join(__dirname, '..', 'public', 'productos');
  if (fs.existsSync(productosDir)) {
    const files = fs.readdirSync(productosDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
    console.log(`📦 Found ${files.length} product images in public/productos...`);

    for (const file of files) {
      const filePath = path.join(productosDir, file);
      const originalBuf = fs.readFileSync(filePath);
      const origSize = originalBuf.length;
      totalOriginal += origSize;

      const baseName = file.replace(/\.[^/.]+$/, '');
      const webpPath = path.join(productosDir, `${baseName}.webp`);

      // 1a. Generate high-efficiency WebP (450x450 max, quality 80)
      const webpBuf = await sharp(originalBuf)
        .resize({ width: 450, height: 450, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toBuffer();
      fs.writeFileSync(webpPath, webpBuf);

      const jpegBuf = await sharp(originalBuf)
        .resize({ width: 450, height: 450, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();
      fs.writeFileSync(filePath, jpegBuf);

      totalOptimized += webpBuf.length;
      console.log(`  ✓ ${baseName}: ${(origSize / 1024).toFixed(1)} KB -> WebP ${(webpBuf.length / 1024).toFixed(1)} KB (JPEG fallback: ${(jpegBuf.length / 1024).toFixed(1)} KB)`);
    }

    // Also check any existing .webp files that might be oversized
    const webpFiles = fs.readdirSync(productosDir).filter(f => f.endsWith('.webp'));
    for (const file of webpFiles) {
      const filePath = path.join(productosDir, file);
      const stat = fs.statSync(filePath);
      if (stat.size > 45 * 1024) {
        const buf = fs.readFileSync(filePath);
        const opt = await sharp(buf)
          .resize({ width: 450, height: 450, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toBuffer();
        fs.writeFileSync(filePath, opt);
        console.log(`  ✓ Re-comprimido ${file}: ${(stat.size / 1024).toFixed(1)} KB -> ${(opt.length / 1024).toFixed(1)} KB`);
      }
    }
  }

  // 2. Optimize Hero & Brand Assets in public/
  const publicDir = path.join(__dirname, '..', 'public');
  const brandAssets = [
    { name: 'logo.png', webp: 'logo.webp', maxWidth: 400, quality: 85, isPng: true },
    { name: 'Imagen de ChatGPT 24 sept 2026, 05_55_02 p.m.png', webp: null, maxWidth: 400, quality: 85, isPng: true },
    { name: 'pets-cutout.png', webp: 'pets-cutout.webp', maxWidth: 1000, quality: 80, isPng: true },
    { name: 'Imagen de ChatGPT 24 sept 2026, 05_43_28 p.m.png', webp: null, maxWidth: 1000, quality: 80, isPng: true },
    { name: 'mobile-pets.png', webp: 'mobile-pets.webp', maxWidth: 700, quality: 80, isPng: true },
    { name: 'mobile-pets-clean.png', webp: null, maxWidth: 700, quality: 80, isPng: true },
    { name: 'mobile-pets-cropped.png', webp: null, maxWidth: 700, quality: 80, isPng: true },
    { name: 'hero-bg.png', webp: 'hero-bg.webp', maxWidth: 1400, quality: 78, isPng: true },
    { name: 'mobile-bg.png', webp: 'mobile-bg.webp', maxWidth: 800, quality: 78, isPng: true },
    { name: 'hero-pets.jpg', webp: 'hero-pets.webp', maxWidth: 1000, quality: 80, isPng: false },
  ];

  console.log('\n🎨 Optimizing Hero, Logo & Brand Assets...');
  for (const item of brandAssets) {
    const filePath = path.join(publicDir, item.name);
    if (!fs.existsSync(filePath)) continue;

    const originalBuf = fs.readFileSync(filePath);
    const origSize = originalBuf.length;
    totalOriginal += origSize;

    if (item.webp) {
      const webpPath = path.join(publicDir, item.webp);
      const webpBuf = await sharp(originalBuf)
        .resize({ width: item.maxWidth, withoutEnlargement: true })
        .webp({ quality: item.quality, effort: 5 })
        .toBuffer();
      fs.writeFileSync(webpPath, webpBuf);
      totalOptimized += webpBuf.length;
      console.log(`  ✓ ${item.name} -> ${item.webp}: ${(origSize / 1024).toFixed(1)} KB -> ${(webpBuf.length / 1024).toFixed(1)} KB`);
    }

    // Also compress the original file in-place so fallback loads light
    let recompressedBuf;
    if (item.isPng) {
      recompressedBuf = await sharp(originalBuf)
        .resize({ width: item.maxWidth, withoutEnlargement: true })
        .png({ quality: item.quality, compressionLevel: 9, effort: 7 })
        .toBuffer();
    } else {
      recompressedBuf = await sharp(originalBuf)
        .resize({ width: item.maxWidth, withoutEnlargement: true })
        .jpeg({ quality: item.quality, mozjpeg: true })
        .toBuffer();
    }
    fs.writeFileSync(filePath, recompressedBuf);
    console.log(`    ↳ (In-place compressed ${item.name}: ${(recompressedBuf.length / 1024).toFixed(1)} KB)`);
  }

  // 3. Optimize fallback placeholders in public/
  const fallbackFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('product-') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')));
  console.log(`\n🐾 Optimizing ${fallbackFiles.length} placeholder files...`);
  for (const file of fallbackFiles) {
    const filePath = path.join(publicDir, file);
    const originalBuf = fs.readFileSync(filePath);
    const origSize = originalBuf.length;
    totalOriginal += origSize;

    const baseName = file.replace(/\.[^/.]+$/, '');
    const webpPath = path.join(publicDir, `${baseName}.webp`);

    const webpBuf = await sharp(originalBuf)
      .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuf);

    const recompressedJpg = await sharp(originalBuf)
      .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(filePath, recompressedJpg);

    totalOptimized += webpBuf.length;
    console.log(`  ✓ ${file}: ${(origSize / 1024).toFixed(1)} KB -> WebP ${(webpBuf.length / 1024).toFixed(1)} KB (JPG: ${(recompressedJpg.length / 1024).toFixed(1)} KB)`);
  }

  const savedMb = ((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Optimization finished! Total saved: ~${savedMb} MB!`);
}

optimizeAll().catch(console.error);
