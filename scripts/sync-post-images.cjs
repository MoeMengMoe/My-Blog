#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

// Allow overriding content root via --content-dir or CONTENT_DIR env var
const argv = process.argv.slice(2);
const contentDirArgIndex = argv.findIndex(a => a.startsWith('--content-dir='));
const contentDir = contentDirArgIndex >= 0
  ? argv[contentDirArgIndex].split('=')[1]
  : process.env.CONTENT_DIR || path.join(__dirname, '..', 'src', 'content');
const POSTS_DIR = path.join(contentDir, 'posts');
const DEST_BASE = path.join(__dirname, '..', 'public', 'assets', 'posts');

// Try to discover site `base` from astro.config.mjs so generated
// web URLs include the base (important when `base` is not '/').
function detectSiteBase() {
  try {
    const fsSync = require('fs');
    const cfgPath = path.join(__dirname, '..', 'astro.config.mjs');
    if (!fsSync.existsSync(cfgPath)) return '';
    const cfg = fsSync.readFileSync(cfgPath, 'utf8');
    const m = cfg.match(/\bbase\s*:\s*['"]([^'"]+)['"]/);
    if (m && m[1]) return m[1];
  } catch (e) {
    // ignore and fallback
  }
  return '';
}

const SITE_BASE = (process.env.SITE_BASE || detectSiteBase() || '').trim();
const SITE_BASE_NORMALIZED = SITE_BASE.endsWith('/') ? SITE_BASE.slice(0, -1) : SITE_BASE;

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

async function processMarkdown(mdPath, rewrite = false) {
  let content = await fs.readFile(mdPath, 'utf8');
  const mdDir = path.dirname(mdPath);
  // regex to match markdown image and html img
  const imageMdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const htmlImgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

  const toCopy = [];

  // handle YAML frontmatter image: value
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    const fmBlock = fmMatch[1];
    const imgLineMatch = fmBlock.match(/^(\s*image\s*:\s*)(.+)$/m);
    if (imgLineMatch) {
      const keyPrefix = imgLineMatch[1];
      let imgVal = imgLineMatch[2].trim();
      // strip quotes if present
      imgVal = imgVal.replace(/^['"]|['"]$/g, '');
      if (isRelativeImageLink(imgVal)) {
        const srcPath = path.normalize(path.join(mdDir, imgVal));
        toCopy.push({ link: imgVal, srcPath });
        const relativeFromPosts = path.relative(POSTS_DIR, srcPath);
        const destWeb = (SITE_BASE_NORMALIZED ? SITE_BASE_NORMALIZED : '') + '/assets/posts/' + relativeFromPosts.replace(/\\/g, '/');
        if (rewrite) {
          const newFmBlock = fmBlock.replace(imgLineMatch[0], keyPrefix + destWeb);
          content = content.replace(fmMatch[0], '---\n' + newFmBlock + '\n---\n');
        }
      }
    }
  }

  function replacer(match, p1) {
    const link = p1.split(/\s+"|\s+'|\)/)[0];
    if (!isRelativeImageLink(link)) return match;
    const srcPath = path.normalize(path.join(mdDir, link));
    toCopy.push({ link, srcPath });
    // compute destination path under public/assets/posts relative to posts dir
    const relativeFromPosts = path.relative(POSTS_DIR, srcPath);
    const destWeb = (SITE_BASE_NORMALIZED ? SITE_BASE_NORMALIZED : '') + '/assets/posts/' + relativeFromPosts.replace(/\\/g, '/');
    if (!rewrite) return match; // do not modify markdown unless requested
    return match.replace(link, destWeb);
  }

  content = content.replace(imageMdRegex, replacer);
  content = content.replace(htmlImgRegex, (match, p1) => {
    if (!isRelativeImageLink(p1)) return match;
    const srcPath = path.normalize(path.join(mdDir, p1));
    toCopy.push({ link: p1, srcPath });
    const relativeFromPosts = path.relative(POSTS_DIR, srcPath);
    const destWeb = (SITE_BASE_NORMALIZED ? SITE_BASE_NORMALIZED : '') + '/assets/posts/' + relativeFromPosts.replace(/\\/g, '/');
    if (!rewrite) return match;
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

  // write back md file only if changes and rewrite requested
  if (rewrite) {
    await fs.writeFile(mdPath, content, 'utf8');
  }
}

async function main() {
  try {
    const allFiles = await walk(POSTS_DIR);
    const mdFiles = allFiles.filter(f => /\.mdx?$/.test(f) || f.endsWith('.md'));
    const rewrite = process.argv.includes('--rewrite') || process.argv.includes('-w');
    console.log(`sync-post-images: rewrite=${rewrite}`);
    for (const md of mdFiles) {
      await processMarkdown(md, rewrite);
    }
    console.log('Sync complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
