import type { RecordModel, SendOptions } from 'pocketbase'
import { pb } from '@/lib/pocketbase'
import type { ContactFormEntry, Property, Testimonial } from '@/types'

type CollectionName = 'properties' | 'contact_forms' | 'testimonials'

type ReadState = {
  snapshots: Map<CollectionName, RecordModel[]>
  pending: Map<CollectionName, Promise<RecordModel[]>>
  retryAfter: Map<CollectionName, number>
  lastLogged: Map<CollectionName, number>
}

const globalReadState = globalThis as typeof globalThis & { __andradePocketBaseReads?: ReadState }
const readState = (globalReadState.__andradePocketBaseReads ??= {
  snapshots: new Map(),
  pending: new Map(),
  retryAfter: new Map(),
  lastLogged: new Map(),
})

const ATTEMPTS = 3
const REQUEST_TIMEOUT_MS = 2_500
const RETRY_DELAYS_MS = [200, 500]
const FAILURE_COOLDOWN_MS = 5_000
const ERROR_LOG_COOLDOWN_MS = 30_000

const fetchWithTimeout: NonNullable<SendOptions['fetch']> = async (input, init) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function isTransient(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const value = error as Record<string, unknown>
  const status = value.status
  if (typeof status === 'number' && (status === 0 || status >= 500)) return true
  if (value.isAbort === true) return true

  const cause = value.originalError ?? value.cause
  if (cause && cause !== error && isTransient(cause)) return true

  const code = value.code
  return typeof code === 'string' && [
    'ECONNABORTED', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH',
    'ENETUNREACH', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT',
  ].includes(code)
}

function logReadFailure(collection: CollectionName, hasSnapshot: boolean) {
  const now = Date.now()
  const lastLogged = readState.lastLogged.get(collection) ?? 0
  if (now - lastLogged < ERROR_LOG_COOLDOWN_MS) return
  readState.lastLogged.set(collection, now)
  console.error(`[PocketBase] ${collection} read unavailable; serving ${hasSnapshot ? 'last good data' : 'empty fallback'}.`)
}

async function loadCollection(collection: CollectionName): Promise<RecordModel[]> {
  const cacheable = collection !== 'contact_forms'
  const cached = cacheable ? readState.snapshots.get(collection) : undefined
  if ((readState.retryAfter.get(collection) ?? 0) > Date.now()) return cached ? [...cached] : []

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const records = await pb.collection(collection).getFullList<RecordModel>({
        sort: '-createdAt',
        fetch: fetchWithTimeout,
      })
      if (cacheable) readState.snapshots.set(collection, records)
      readState.retryAfter.delete(collection)
      return [...records]
    } catch (error) {
      if (!isTransient(error)) throw error
      if (attempt < ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
      }
    }
  }

  readState.retryAfter.set(collection, Date.now() + FAILURE_COOLDOWN_MS)
  logReadFailure(collection, cached !== undefined)
  return cached ? [...cached] : []
}

export function readPocketBaseCollection(collection: CollectionName): Promise<RecordModel[]> {
  const pending = readState.pending.get(collection)
  if (pending) return pending.then((records) => [...records])

  const request = loadCollection(collection)
  readState.pending.set(collection, request)
  return request.finally(() => {
    if (readState.pending.get(collection) === request) readState.pending.delete(collection)
  })
}

export function invalidatePocketBaseCollection(collection: CollectionName) {
  readState.snapshots.delete(collection)
  readState.retryAfter.delete(collection)
}

export function withoutPocketBaseMetadata<T extends RecordModel>(record: T) {
  const { collectionId: _collectionId, collectionName: _collectionName, expand: _expand, ...data } = record
  return data
}

export async function listProperties(): Promise<Property[]> {
  return (await readPocketBaseCollection('properties')).map((record) => withoutPocketBaseMetadata(record)) as Property[]
}

export async function listContactForms(): Promise<ContactFormEntry[]> {
  return (await readPocketBaseCollection('contact_forms')).map((record) => withoutPocketBaseMetadata(record)) as ContactFormEntry[]
}

export async function listTestimonials(): Promise<Testimonial[]> {
  return (await readPocketBaseCollection('testimonials')).map((record) => withoutPocketBaseMetadata(record)) as Testimonial[]
}
