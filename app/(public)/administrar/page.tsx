import { Metadata } from 'next'
import Link from 'next/link'
import AdministrarForm from '@/components/contact/AdministrarForm'

export const metadata: Metadata = {
  title: 'Administrar | Grupo Chalita',
  description: 'Administrá tu propiedad con la asesoría de Grupo Chalita.',
}

export default function AdministrarPage() {
  return (
    <main className="min-h-screen bg-[#1A1810] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[#7A6845] hover:text-[#F5EDD8] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[#D4AF6B] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Administrar
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F5EDD8] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Administrá sin preocupaciones
          </h1>
          <p className="text-[#7A6845] text-base leading-relaxed">
            Completá el formulario y un vendedor te contactará por WhatsApp.
          </p>
        </div>

        <AdministrarForm />
      </div>
    </main>
  )
}
