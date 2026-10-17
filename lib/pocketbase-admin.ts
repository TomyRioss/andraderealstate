import 'server-only'
import PocketBase from 'pocketbase'

const admin = new PocketBase(
  process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8093',
)
admin.autoCancellation(false)

let authenticating: Promise<unknown> | undefined

export async function getAdminPocketBase() {
  if (!admin.authStore.isValid) {
    const email = process.env.POCKETBASE_SUPERUSER_EMAIL
    const password = process.env.POCKETBASE_SUPERUSER_PASSWORD
    if (!email || !password) throw new Error('Missing PocketBase server credentials')

    authenticating ??= admin.collection('_superusers').authWithPassword(email, password)
    try {
      await authenticating
    } finally {
      authenticating = undefined
    }
  }
  return admin
}
