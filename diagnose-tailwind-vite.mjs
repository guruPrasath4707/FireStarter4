#!/usr/bin/env node
// diagnose-tailwind-vite.mjs
// Run: node diagnose-tailwind-vite.mjs  [--fix]
// Purpose: Detect why Vite is still invoking PostCSS for Tailwind v4 Option B.

import fs from 'fs'
import path from 'path'
import url from 'url'

const FIX = process.argv.includes('--fix')
const root = process.cwd()

const log = {
  info: (m)=>console.log('ℹ️', m),
  ok:   (m)=>console.log('✅', m),
  warn: (m)=>console.log('⚠️', m),
  err:  (m)=>console.log('❌', m),
  step: (m)=>console.log('\n— ' + m)
}

function exists(p){ try { fs.accessSync(p); return true } catch { return false } }
function read(p){ try { return fs.readFileSync(p, 'utf8') } catch { return '' } }
function json(p){ try { return JSON.parse(read(p)) } catch { return null } }

function globCandidates(names){
  return names.map(n => path.join(root, n)).filter(exists)
}

// 1) Basic project info
log.step('Project root: ' + root)
const pkgPath = path.join(root, 'package.json')
const pkg = json(pkgPath) || {}
if (!pkg.name) log.warn('package.json not found or unreadable.')

// 2) Check Tailwind and plugin versions (best effort)
let tailwindVersion = null
let vitePluginVersion = null
try {
  const mod = await import(url.pathToFileURL(path.join(root, 'node_modules/tailwindcss/package.json')).href)
  tailwindVersion = mod.default.version || mod.version
} catch {}
try {
  const mod = await import(url.pathToFileURL(path.join(root, 'node_modules/@tailwindcss/vite/package.json')).href)
  vitePluginVersion = mod.default.version || mod.version
} catch {}

if (tailwindVersion) log.ok('tailwindcss version: ' + tailwindVersion)
else log.warn('tailwindcss is not installed (or cannot be resolved).')

if (vitePluginVersion) log.ok('@tailwindcss/vite version: ' + vitePluginVersion)
else log.warn('@tailwindcss/vite is not installed (or cannot be resolved).')

// 3) Find PostCSS configs that trigger PostCSS in Vite
const postcssFiles = globCandidates(['postcss.config.js', 'postcss.config.cjs', '.postcssrc', '.postcssrc.js', '.postcssrc.cjs', '.postcssrc.json'])
if (postcssFiles.length) {
  log.err('PostCSS config detected (these files make Vite run PostCSS):')
  postcssFiles.forEach(f => console.log('   -', path.relative(root, f)))
} else {
  log.ok('No PostCSS config files detected at project root.')
}

// 4) Check package.json for top-level "postcss" field
if (pkg.postcss) {
  log.err('package.json has a top-level "postcss" field which also triggers PostCSS.')
  console.log('   Consider removing it for Option B.')
} else {
  log.ok('package.json has no top-level "postcss" field.')
}

// 5) Inspect vite.config.* for @tailwindcss/vite and any PostCSS plugin usage
const viteFiles = globCandidates(['vite.config.ts','vite.config.js','vite.config.mjs','vite.config.cjs','vite.config.mts'])
if (viteFiles.length === 0) {
  log.warn('No vite.config.* file found. (Vite will use defaults; for Option B you must add @tailwindcss/vite plugin.)')
} else {
  const vf = viteFiles[0]
  const vContent = read(vf)
  const hasPlugin = /@tailwindcss\/vite/.test(vContent) && /tailwind\(\)/.test(vContent)
  const mentionsPostCSS = /postcss/i.test(vContent)
  if (hasPlugin) log.ok('vite config includes @tailwindcss/vite plugin.')
  else log.err('vite config does NOT include @tailwindcss/vite plugin. Add it for Option B.')

  if (mentionsPostCSS) log.warn('vite config mentions "postcss" – verify it does not wire Tailwind via PostCSS.')
  console.log('   Checked:', path.relative(root, vf))
}

// 6) Inspect CSS entry for v4 usage
const cssCandidates = [
  path.join(root, 'src/index.css'),
  path.join(root, 'src/styles.css'),
  path.join(root, 'index.css'),
]
const cssFile = cssCandidates.find(exists)
if (!cssFile) {
  log.err('Could not find your CSS entry (expected src/index.css). Ensure main.jsx imports it.')
} else {
  const css = read(cssFile)
  const usesV4Import = /@import\s+["']tailwindcss["']\s*;/.test(css)
  const usesV3Directives = /@tailwind\s+base|@tailwind\s+components|@tailwind\s+utilities/.test(css)

  log.info('CSS file: ' + path.relative(root, cssFile))
  if (usesV4Import) log.ok('CSS uses Tailwind v4 single import: @import "tailwindcss";')
  if (usesV3Directives) log.warn('CSS still contains v3-style @tailwind directives (ok but not required in v4).')

  if (!usesV4Import && !usesV3Directives) log.warn('CSS does not seem to include Tailwind.')
}

// 7) Confirm main.jsx imports the CSS
const mainCandidates = [path.join(root, 'src/main.jsx'), path.join(root, 'src/main.tsx')]
const mainFile = mainCandidates.find(exists)
if (!mainFile) {
  log.err('Cannot find src/main.jsx/tsx')
} else {
  const m = read(mainFile)
  if (/import\s+['\"]\.\/index\.css['\"]/.test(m)) log.ok('main imports ./index.css')
  else log.err('main.jsx does NOT import ./index.css – add: import "./index.css"')
  log.info('Entry: ' + path.relative(root, mainFile))
}

// 8) Look for tailwind usage in PostCSS configs (which would cause the error you see)
for (const pc of postcssFiles) {
  const c = read(pc)
  if (/tailwindcss\s*:\s*\{\}/.test(c) || /require\(['\"]tailwindcss['\"]\)/.test(c)) {
    log.err('PostCSS config references tailwindcss directly (v3 style): ' + path.relative(root, pc))
    console.log('   This will trigger the exact error you see in v4.')
  }
}

// 9) Suggest automatic fix (rename PostCSS configs) if --fix passed
if (FIX && postcssFiles.length) {
  log.step('Applying --fix: renaming PostCSS configs to .bak to disable PostCSS…')
  for (const pc of postcssFiles) {
    const bak = pc + '.bak'
    try {
      fs.renameSync(pc, bak)
      log.ok('Renamed ' + path.relative(root, pc) + ' -> ' + path.basename(bak))
    } catch (e) {
      log.err('Failed to rename ' + pc + ': ' + e.message)
    }
  }
}

// 10) Final summary
const problems = []
if (postcssFiles.length) problems.push('PostCSS config files exist')
if (pkg.postcss) problems.push('package.json has a "postcss" field')
if (viteFiles.length && !/@tailwindcss\/vite/.test(read(viteFiles[0]))) problems.push('vite config missing @tailwindcss/vite')
if (!cssFile) problems.push('No CSS entry file found')
if (mainFile && !/import\s+['\"]\.\/index\.css['\"]/.test(read(mainFile))) problems.push('main.jsx missing "./index.css" import')

if (problems.length === 0) {
  log.ok('\nAll checks passed for Option B. If the error persists, Vite is still discovering a PostCSS config via an unexpected path.')
  log.info('Search for *any* postcss config above your project or in a monorepo root.')
} else {
  log.warn('\nOutstanding issues detected:')
  for (const p of problems) console.log(' -', p)
  log.info('Fix the above and restart: npm run dev')
}
