#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const branch = process.argv[2] || 'gh-pages';

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, Object.assign({ stdio: 'inherit' }, opts));
  if (r.error) {
    console.error(r.error);
    process.exit(1);
  }
  if (r.status !== 0) process.exit(r.status);
}

function safeReadRemote() {
  const r = spawnSync('git', ['config', '--get', 'remote.origin.url'], { cwd: projectRoot, encoding: 'utf8' });
  if (r.status === 0 && r.stdout) return r.stdout.trim();
  return null;
}

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/ not found. Run `pnpm run build` first.');
  process.exit(1);
}

console.log(`Deploying ${distDir} → branch ${branch}`);

// Try git worktree approach first
try {
  // fetch remote updates
  run('git', ['fetch', 'origin'], { cwd: projectRoot });

  // remove any existing worktree at dist (force) to ensure clean state
  try { run('git', ['worktree', 'remove', '--force', distDir], { cwd: projectRoot }); } catch (e) {}

  // Attempt to add a worktree pointing to origin/branch (if exists) otherwise create orphan branch
  const originBranchCheck = spawnSync('git', ['rev-parse', '--verify', `origin/${branch}`], { cwd: projectRoot, stdio: 'ignore' });
  if (originBranchCheck.status === 0) {
    run('git', ['worktree', 'add', '-B', branch, distDir, `origin/${branch}`], { cwd: projectRoot });
  } else {
    // create new branch via worktree based on current HEAD
    run('git', ['worktree', 'add', '-B', branch, distDir], { cwd: projectRoot });
  }

  // Now commit the contents of dist
  run('git', ['add', '-A'], { cwd: distDir });
  // ensure committer
  try { run('git', ['config', 'user.email'], { cwd: distDir }); } catch (e) {}
  run('git', ['commit', '-m', `Deploy: ${new Date().toISOString()}`], { cwd: distDir });

  const remote = safeReadRemote();
  if (remote) {
    // set origin if not present in the worktree repo
    const hasRemote = spawnSync('git', ['remote', 'get-url', 'origin'], { cwd: distDir, stdio: 'ignore' });
    if (hasRemote.status !== 0) run('git', ['remote', 'add', 'origin', remote], { cwd: distDir });

    // push
    run('git', ['push', 'origin', branch, '--force'], { cwd: distDir });
  } else {
    console.warn('No remote.origin found; commit created locally in dist/ worktree. Skipping push.');
  }

  // cleanup worktree
  run('git', ['worktree', 'remove', distDir], { cwd: projectRoot });

  console.log('Deploy (worktree) complete.');
  process.exit(0);
} catch (err) {
  console.warn('Worktree deploy failed, falling back to init+push method:', err && err.message);
}

// Fallback: init a temporary repo inside dist and force-push
try {
  // remove any existing .git inside dist
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  run('git', ['init'], { cwd: distDir });

  const remote = safeReadRemote();
  if (remote) run('git', ['remote', 'add', 'origin', remote], { cwd: distDir });

  // ensure committer identity
  try { run('git', ['config', 'user.email', 'deploy@local'], { cwd: distDir }); } catch (e) {}
  try { run('git', ['config', 'user.name', 'deploy-script'], { cwd: distDir }); } catch (e) {}

  run('git', ['add', '-A'], { cwd: distDir });
  try { run('git', ['commit', '-m', `Deploy: ${new Date().toISOString()}`], { cwd: distDir }); } catch (e) {}

  if (remote) {
    run('git', ['push', '-f', 'origin', `HEAD:${branch}`], { cwd: distDir });
    console.log('Deploy (fallback) complete.');
    process.exit(0);
  } else {
    console.error('No remote configured; cannot push. Remote origin not found.');
    process.exit(1);
  }
} catch (e) {
  console.error('Fallback deploy failed:', e && e.message);
  process.exit(1);
}
