import { Metadata } from 'next'
import Link from 'next/link'
import AdministrarForm from '@/components/contact/AdministrarForm'

export const metadata: Metadata = {
  title: 'Administrar | Andrade Real Estate',
  description: 'Administrá tu propiedad con la asesoría de Andrade Real Estate.',
}

export default function AdministrarPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EE] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[#8C7B6B] hover:text-[#18140D] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[#B07030] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Administrar
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#18140D] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Administrá sin preocupaciones
          </h1>
          <p className="text-[#8C7B6B] text-base leading-relaxed">
            Completá el formulario y un vendedor te contactará por WhatsApp.
          </p>
        </div>

        <AdministrarForm />
      </div>
    </main>
  )
}
