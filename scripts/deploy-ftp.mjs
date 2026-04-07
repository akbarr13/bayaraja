import { Client } from 'basic-ftp'
import { readFileSync, readdirSync, statSync, writeFileSync, rmSync, existsSync, cpSync } from 'fs'
import { zipSync } from 'fflate'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env.ftp manually (no dotenv dependency)
const env = Object.fromEntries(
  readFileSync(path.join(ROOT, '.env.ftp'), 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=')
      return [k.trim(), v.join('=').trim().replace(/^"|"$/g, '')]
    })
)

const DEPLOY_DIR = path.join(ROOT, 'deploy')
const ZIP_PATH = path.join(ROOT, 'deploy.zip')

// ── Step 1: Assemble ─────────────────────────────────────────────────────────
console.log('[1/3] Assembling deploy folder...')
if (existsSync(DEPLOY_DIR)) rmSync(DEPLOY_DIR, { recursive: true, force: true })

// Next.js standalone can mirror the full source path inside the output dir.
// Find the actual root by locating server.js recursively.
function findStandaloneRoot(dir) {
  // Check current dir first (shallowest wins, skip node_modules)
  if (readdirSync(dir).includes('server.js')) return dir
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue
    const abs = path.join(dir, name)
    if (statSync(abs).isDirectory()) {
      const found = findStandaloneRoot(abs)
      if (found) return found
    }
  }
  return null
}

const standaloneRoot = findStandaloneRoot(path.join(ROOT, '.next', 'standalone'))
if (!standaloneRoot) throw new Error('server.js tidak ditemukan di .next/standalone')
console.log(`   → standalone root: ${standaloneRoot}`)

cpSync(standaloneRoot, DEPLOY_DIR, { recursive: true })
cpSync(path.join(ROOT, 'public'), path.join(DEPLOY_DIR, 'public'), { recursive: true })
cpSync(path.join(ROOT, '.next', 'static'), path.join(DEPLOY_DIR, '.next', 'static'), { recursive: true })

// ── Step 2: Zip ──────────────────────────────────────────────────────────────
console.log('[2/3] Zipping...')

function collectFiles(dir, base = '') {
  const entries = {}
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name)
    const rel = (base ? `${base}/${name}` : name).replace(/\\/g, '/')
    if (statSync(abs).isDirectory()) {
      Object.assign(entries, collectFiles(abs, rel))
    } else {
      entries[rel] = readFileSync(abs)
    }
  }
  return entries
}

const zip = zipSync(collectFiles(DEPLOY_DIR), { level: 6 })
writeFileSync(ZIP_PATH, zip)
console.log(`   → deploy.zip: ${(zip.byteLength / 1024 / 1024).toFixed(1)} MB`)

// ── Step 3: Upload ───────────────────────────────────────────────────────────
console.log('[3/3] Uploading deploy.zip to FTP root...')
const client = new Client()
client.ftp.verbose = false

await client.access({
  host: env.FTP_HOST,
  user: env.FTP_USER,
  password: env.FTP_PASS,
  secure: false,
})

if (env.FTP_REMOTE_PATH) {
  await client.ensureDir(env.FTP_REMOTE_PATH)
  await client.cd(env.FTP_REMOTE_PATH)
}

await client.uploadFrom(ZIP_PATH, 'deploy.zip')
console.log('Done! deploy.zip uploaded.')
client.close()

// ── Cleanup ──────────────────────────────────────────────────────────────────
rmSync(DEPLOY_DIR, { recursive: true, force: true })
rmSync(ZIP_PATH)
console.log('Local cleanup done.')
console.log('')
console.log('Next step: on the server, extract deploy.zip and restart the Node.js process (e.g. via PM2).')
