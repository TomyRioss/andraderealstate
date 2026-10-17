import { Metadata } from 'next'
import Link from 'next/link'
import AdministrarForm from '@/components/contact/AdministrarForm'

export const metadata: Metadata = {
  title: 'Administrar | Andrade & Co Real Estate',
  description: 'Acompañamiento profesional en la administración de tu propiedad.',
}

export default function AdministrarPage() {
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
            Administrar
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0D1A2D] mb-3">
            Administra tu propiedad con certeza
          </h1>
          <p className="text-[#525252] text-base leading-relaxed">
            Completa el formulario para recibir asesoría sobre la administración de tu propiedad.
          </p>
        </div>

        <AdministrarForm />
      </div>
    </main>
  )
}
