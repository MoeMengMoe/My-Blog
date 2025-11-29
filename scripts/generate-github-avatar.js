#!/usr/bin/env node
// Fetch GitHub avatar and create 128x128 circular JPG images for avatar and tag
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const username = 'MoeMengMoe';
const avatarUrl = `https://github.com/${username}.png`;
const outDir = path.resolve(process.cwd(), 'public', 'avatar');
const sizes = [128];

async function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async function main(){
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    console.log('Downloading avatar from', avatarUrl);
    const buf = await fetchImage(avatarUrl);

    for (const size of sizes) {
      const outPath = path.join(outDir, size === 128 ? 'avatar.jpg' : `avatar-${size}.jpg`);
      const tagPath = path.join(outDir, size === 128 ? 'tag.jpg' : `tag-${size}.jpg`);

      // Create circular mask SVG
      const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff" />
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#000" />
      </svg>`;

      // Resize and apply mask (dest-in) then flatten onto white and output jpeg
      const circ = await sharp(buf)
        .resize(size, size, { fit: 'cover' })
        .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 90 })
        .toBuffer();

      fs.writeFileSync(outPath, circ);
      fs.writeFileSync(tagPath, circ);

      console.log('Wrote', outPath, 'and', tagPath);
    }

    console.log('Avatar generation finished.');
  } catch (err) {
    console.error('Failed to generate avatar:', err);
    process.exit(1);
  }
})();
