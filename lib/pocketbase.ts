import PocketBase from 'pocketbase'

export const pb = new PocketBase(
  process.env.POCKETBASE_URL ?? process.env.NEXT_PUBLIC_POCKETBASE_URL ?? 'http://127.0.0.1:8093',
)
pb.autoCancellation(false)