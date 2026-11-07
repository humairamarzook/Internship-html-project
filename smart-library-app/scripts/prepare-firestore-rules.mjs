import { readFile, writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), '')
const adminEmail = env.FIRESTORE_ADMIN_EMAIL?.trim().toLowerCase()

if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
  throw new Error('Set a valid FIRESTORE_ADMIN_EMAIL in .env.local before deploying.')
}

const template = await readFile('firestore.rules.template', 'utf8')
const escapedEmail = adminEmail.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
const rules = template.replaceAll('__ADMIN_EMAIL__', escapedEmail)

await writeFile('firestore.rules', rules, 'utf8')
console.log('Prepared Firestore rules with private administrator access.')
