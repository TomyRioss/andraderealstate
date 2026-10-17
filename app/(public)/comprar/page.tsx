import { Metadata } from 'next'
import Link from 'next/link'
import ComprarForm from '@/components/contact/ComprarForm'

export const metadata: Metadata = {
  title: 'Comprar | Andrade & Co Real Estate',
  description: 'Acompañamiento estratégico para estructurar la compra de tu propiedad.',
}

export default function ComprarPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[#525252] hover:text-[#0D1A2D] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[#0D1A2D] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Comprar
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0D1A2D] mb-3">
            Encuentra una propiedad adecuada para ti
          </h1>
          <p className="text-[#525252] text-base leading-relaxed">
            Comparte tus criterios de búsqueda. Nuestro equipo te orientará en el proceso.
          </p>
        </div>

        <ComprarForm />
      </div>
    </main>
  )
}
