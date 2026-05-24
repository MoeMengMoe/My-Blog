Param(
    [switch]$SkipInstall,
    [string]$Branch = "gh-pages",
    [switch]$NoForce
)

Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path (Join-Path $scriptRoot "..")
Set-Location $projectRoot

Write-Output "Project root: $projectRoot"

if (-not $SkipInstall) {
    Write-Output "Installing dependencies... (pnpm install)"
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "pnpm install failed"
        exit $LASTEXITCODE
    }
}

Write-Output "Building site... (pnpm run build)"
pnpm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit $LASTEXITCODE
}

# Ensure .nojekyll so GitHub Pages doesn't process the site with Jekyll
$noJekyll = Join-Path $projectRoot "dist\.nojekyll"
if (-not (Test-Path $noJekyll)) {
    New-Item -ItemType File -Path $noJekyll -Force | Out-Null
}

$remote = git config --get remote.origin.url
if (-not $remote) {
    Write-Error "No remote 'origin' configured. Please set a git remote origin."
    exit 1
}

Write-Output "Using remote: $remote"

Push-Location (Join-Path $projectRoot "dist")

if (-not (Test-Path ".git")) {
    git init > $null
}

# Ensure a committer identity exists for the temporary repo
try { git config user.email > $null } catch {}
if (-not (git config user.email)) { git config user.email "deploy@local" }
if (-not (git config user.name)) { git config user.name "deploy-script" }

git add -A
try {
    git commit -m ("Deploy: {0}" -f (Get-Date -Format o)) -q
} catch {
    Write-Output "No changes to commit in dist/"
}

git branch -M $Branch

# Replace origin remote for the temporary repo and push
try { git remote get-url origin > $null; git remote remove origin } catch {}
git remote add origin $remote

if ($NoForce) {
    git push origin $Branch
} else {
    git push -f origin $Branch
}

Pop-Location

Write-Output "Deployment complete: $remote#$Branch"
exit 0
