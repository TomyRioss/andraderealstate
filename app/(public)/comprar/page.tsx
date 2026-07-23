import { Metadata } from 'next'
import Link from 'next/link'
import ComprarForm from '@/components/contact/ComprarForm'

export const metadata: Metadata = {
  title: 'Comprar | Grupo Chalita',
  description: 'Encuentra la propiedad ideal con la asesoría de Grupo Chalita.',
}

export default function ComprarPage() {
  return (
    <main className="min-h-screen bg-[#1A1810] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[#7A6845] hover:text-[#D4AF6B] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[#D4AF6B] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Comprar
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#F5EDD8] mb-3">
            Encuentra tu propiedad ideal
          </h1>
          <p className="text-[#7A6845] text-base leading-relaxed">
            Cuéntanos qué buscas y te contactamos en menos de 24 horas.
          </p>
        </div>

        <ComprarForm />
      </div>
    </main>
  )
}
