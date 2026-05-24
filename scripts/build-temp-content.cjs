#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { spawnSync } = require('child_process');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  const root = path.join(__dirname, '..');
  const srcContent = path.join(root, 'src', 'content');
  const tmpContent = path.join(root, '.tmp_content_build');
  const backupContent = path.join(root, 'src', `content.bak.${Date.now()}`);

  if (!await exists(srcContent)) {
    console.error('Source content folder not found:', srcContent);
    process.exit(1);
  }

  // cleanup any stale tmp
  try { await fs.rm(tmpContent, { recursive: true, force: true }); } catch (e) {}

  console.log('Copying src/content ->', tmpContent);
  await fs.cp(srcContent, tmpContent, { recursive: true });

  // run sync-post-images.cjs on the tmp content with rewrite
  console.log('Running image sync (rewrite) on temporary content...');
  const syncCmd = 'node';
  const syncArgs = ['scripts/sync-post-images.cjs', '--rewrite', `--content-dir=${tmpContent}`];
  const sync = spawnSync(syncCmd, syncArgs, { cwd: root, stdio: 'inherit' });
  if (sync.error) {
    console.error('Failed to run sync script:', sync.error);
    process.exit(1);
  }
  if (sync.status !== 0) {
    console.error('sync-post-images exited with code', sync.status);
    process.exit(sync.status);
  }

  // swap directories: move original to backup, move tmp to src/content
  console.log('Swapping content directories (original -> backup, tmp -> src/content)');
  try {
    await fs.rename(srcContent, backupContent);
    await fs.rename(tmpContent, srcContent);
  } catch (err) {
    console.error('Failed to swap content directories:', err);
    // attempt rollback cleanup
    try { await fs.rename(backupContent, srcContent); } catch (_) {}
    process.exit(1);
  }

  // run build
  console.log('Running build...');
  // Run build but set env var to skip the wrapper prebuild step to avoid recursion
  const env = Object.assign({}, process.env, { SKIP_BUILD_WRAPPER: '1' });
  const build = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true, env });

  // restore original content
  console.log('Restoring original content...');
  try {
    // remove the generated src/content
    await fs.rm(srcContent, { recursive: true, force: true });
    // move backup back
    await fs.rename(backupContent, srcContent);
  } catch (err) {
    console.error('Failed to restore original content:', err);
    process.exit(1);
  }

  if (build.error) {
    console.error('Build command failed:', build.error);
    process.exit(1);
  }
  process.exit(build.status);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
