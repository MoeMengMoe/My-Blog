const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../public/avatar/tag.jpg');
const outDir = path.resolve(__dirname, '../public/favicon');
const sizes = [32, 64, 180, 192];

async function make(size) {
  const out = path.join(outDir, `tag-favicon-${size}.png`);
  // create circular mask SVG
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${size}" height="${size}" rx="${size/2}" ry="${size/2}" fill="#fff"/></svg>`;
  await sharp(src)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
    .png()
    .toFile(out);
  console.log(`Generated ${out}`);
}

(async () => {
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    for (const s of sizes) await make(s);
    console.log('All favicons generated.');
  } catch (err) {
    console.error('Failed to generate favicons:', err);
    process.exitCode = 1;
  }
})();