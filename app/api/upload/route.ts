import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2 } from '@/lib/r2'

const ALLOWED_FOLDERS = ['contact-uploads', 'property-images', 'product-images']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const folder = formData.get('folder')
    if (typeof folder !== 'string' || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 })
    }

    const files = formData.getAll('files').filter((f): f is File => f instanceof File)
    if (files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 })
    }

    const urls: string[] = []
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const key = `${Date.now()}-${safeName}`
      const url = await uploadToR2(folder, key, file)
      urls.push(url)
    }

    return NextResponse.json({ urls }, { status: 201 })
  } catch (err) {
    console.error('[api/upload] error:', err)
    return NextResponse.json({ error: 'Error subiendo archivos' }, { status: 500 })
  }
}
