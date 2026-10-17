'use client'

import { useEffect } from 'react'

export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[public] No se pudo cargar la página', error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F5F5F5] px-6 py-20 text-center">
      <div className="max-w-lg">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#525252]">
          Andrade &amp; Co Real Estate
        </p>
        <h1 className="mb-4 font-display text-3xl font-semibold text-[#0D1A2D] sm:text-4xl">
          No pudimos cargar esta página
        </h1>
        <p className="mb-8 text-sm leading-6 text-[#525252] sm:text-base">
          Hubo un problema al recuperar la información. Vuelve a intentarlo.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={unstable_retry}
            className="rounded-md bg-[#0D1A2D] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0D1A2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3B3B3] focus-visible:ring-offset-2"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="rounded-md border border-[#B3B3B3] px-5 py-3 text-sm font-medium text-[#0D1A2D] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3B3B3] focus-visible:ring-offset-2"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </main>
  )
}
