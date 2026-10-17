import { NextRequest, NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import { auth } from '@/auth'

const LIMIT = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File) || file.size > LIMIT) {
    return NextResponse.json({ error: 'Archivo inválido o mayor a 10 MB' }, { status: 400 })
  }
  const bucket = String(form.get('bucket') ?? '')
  if (!['property-images', 'contact-uploads'].includes(bucket)) {
    return NextResponse.json({ error: 'Destino inválido' }, { status: 400 })
  }
  if (bucket === 'property-images' && !(await auth())?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const record = await pb.collection('uploads').create({ file, bucket })
  return NextResponse.json({ path: `${record.id}/${record.file}` })
}
