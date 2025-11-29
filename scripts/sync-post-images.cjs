#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const DEST_BASE = path.join(__dirname, '..', 'public', 'assets', 'posts');

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const d of list) {
    const res = path.join(dir, d.name);
    if (d.isDirectory()) {
      results = results.concat(await walk(res));
    } else {
      results.push(res);
    }
  }
  return results;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function isRelativeImageLink(link) {
  if (!link) return false;
  // ignore absolute URLs and absolute paths starting with /
  if (/^(https?:)?\/\//i.test(link)) return false;
  if (link.startsWith('/')) return false;
  // typical relative image patterns: ./img.png or img.png or ../x.png
  return true;
}

async function processMarkdown(mdPath) {
  let content = await fs.readFile(mdPath, 'utf8');
  const mdDir = path.dirname(mdPath);
  // regex to match markdown image and html img
  const imageMdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const htmlImgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

  const toCopy = [];

  function replacer(match, p1) {
    const link = p1.split(/\s+"|\s+'|\)/)[0];
    if (!isRelativeImageLink(link)) return match;
    const srcPath = path.normalize(path.join(mdDir, link));
    if (!srcPath.startsWith(POSTS_DIR)) {
      // if image outside posts, still copy relative to md dir
    }
    toCopy.push({ link, srcPath });
    // compute destination path under public/assets/posts relative to posts dir
    const relativeFromPosts = path.relative(POSTS_DIR, srcPath);
    const destWeb = '/assets/posts/' + relativeFromPosts.replace(/\\\\/g, '/');
    return match.replace(link, destWeb);
  }

  content = content.replace(imageMdRegex, replacer);
  content = content.replace(htmlImgRegex, (match, p1) => {
    if (!isRelativeImageLink(p1)) return match;
    const srcPath = path.normalize(path.join(mdDir, p1));
    toCopy.push({ link: p1, srcPath });
    const relativeFromPosts = path.relative(POSTS_DIR, srcPath);
    const destWeb = '/assets/posts/' + relativeFromPosts.replace(/\\\\/g, '/');
    return match.replace(p1, destWeb);
  });

  // copy files
  for (const item of toCopy) {
    try {
      const stat = await fs.stat(item.srcPath);
      if (!stat.isFile()) continue;
    } catch (err) {
      console.warn(`Warning: source image not found: ${item.srcPath}`);
      continue;
    }
    const relativeFromPosts = path.relative(POSTS_DIR, item.srcPath);
    const destPath = path.join(DEST_BASE, relativeFromPosts);
    await ensureDir(path.dirname(destPath));
    await fs.copyFile(item.srcPath, destPath);
    console.log(`Copied ${item.srcPath} -> ${destPath}`);
  }

  // write back md file only if changes
  await fs.writeFile(mdPath, content, 'utf8');
}

async function main() {
  try {
    const allFiles = await walk(POSTS_DIR);
    const mdFiles = allFiles.filter(f => /\.mdx?$/.test(f) || f.endsWith('.md'));
    for (const md of mdFiles) {
      await processMarkdown(md);
    }
    console.log('Sync complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
