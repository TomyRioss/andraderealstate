import { pb } from '@/lib/pocketbase'
import { auth } from '@/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[a-z0-9]{15}$/.test(id)) return new Response('Not found', { status: 404 })
  try {
    const record = await pb.collection('uploads').getOne(id)
    if (record.bucket === 'contact-uploads' && !(await auth())?.user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const file = record.file as string
    const response = await fetch(`${pb.baseURL}/api/files/uploads/${id}/${encodeURIComponent(file)}`)
    if (!response.ok || !response.body) return new Response('Not found', { status: 404 })
    return new Response(response.body, { headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    } })
  } catch { return new Response('Not found', { status: 404 }) }
}
