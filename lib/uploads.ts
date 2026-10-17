export async function uploadPocketBaseFile(bucket: string, path: string, file: File) {
  const form = new FormData()
  form.set('bucket', bucket)
  form.set('path', path)
  form.set('file', file)
  const response = await fetch('/api/uploads', { method: 'POST', body: form })
  const body = await response.json()
  return response.ok
    ? { data: { path: body.path }, error: null }
    : { data: null, error: new Error(body.error ?? 'Error al subir el archivo') }
}

export function pocketBasePublicUrl(path: string) {
  const id = path.split('/')[0] ?? ''
  return { data: { publicUrl: `/api/uploads/file/${encodeURIComponent(id)}` } }
}
