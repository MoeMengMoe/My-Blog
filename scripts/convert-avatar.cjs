#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function convertFromSvg(srcSvgPath, outFile) {
  const buf = await fs.readFile(srcSvgPath);
  const size = 128;
  const roundedSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${size/2}" ry="${size/2}"/></svg>`
  );

  const outBuf = await sharp(buf)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: roundedSvg, blend: 'dest-in' }])
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toBuffer();

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, outBuf);
  console.log(`Wrote ${outFile}`);
}

(async function main(){
  try {
    const base = path.join(__dirname, '..', 'public', 'avatar');
    const src = path.join(base, 'moemengmoe.svg');
    await convertFromSvg(src, path.join(base, 'avatar.jpg'));
    await convertFromSvg(src, path.join(base, 'tag.jpg'));
    console.log('SVG conversion complete.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
