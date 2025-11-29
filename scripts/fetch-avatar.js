#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function fetchBuffer(url) {
  if (typeof fetch === 'function') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  // Node <18 fallback: use https
  return new Promise((resolve, reject) => {
    const https = require('https');
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function makeRoundedJpegFromGithub(username, outFile) {
  const url = `https://github.com/${username}.png?size=460`;
  console.log(`Fetching avatar from: ${url}`);
  const buf = await fetchBuffer(url);
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

async function main() {
  try {
    const user = 'MoeMengMoe';
    const base = path.join(__dirname, '..', 'public', 'avatar');
    await makeRoundedJpegFromGithub(user, path.join(base, 'avatar.jpg'));
    await makeRoundedJpegFromGithub(user, path.join(base, 'tag.jpg'));
    console.log('Avatar generation complete.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
