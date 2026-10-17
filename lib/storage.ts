export function createStorageClient() {
  return {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          const form = new FormData()
          form.set('bucket', bucket)
          form.set('path', path)
          form.set('file', file)
          const response = await fetch('/api/uploads', { method: 'POST', body: form })
          const result = await response.json()
          return response.ok
            ? { data: { path: result.path }, error: null }
            : { data: null, error: new Error(result.error ?? 'Error al subir el archivo') }
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `/api/uploads/file/${encodeURIComponent(path.split('/')[0] ?? '')}` } }
        },
      }
    },
  }
}
