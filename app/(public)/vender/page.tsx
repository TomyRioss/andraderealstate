import { Metadata } from 'next'
import Link from 'next/link'
import VenderForm from '@/components/contact/VenderForm'

export const metadata: Metadata = {
  title: 'Vender | Grupo Chalita',
  description: 'Vende tu propiedad con la asesoría de Grupo Chalita.',
}

export default function VenderPage() {
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
          <p className="text-[#B8912A] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Vender / Alquilar
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#F5EDD8] mb-3">
            Vende tu propiedad sin contratiempos
          </h1>
          <p className="text-[#7A6845] text-base leading-relaxed">
            Cargá tu propiedad y te contactamos para comenzar el proceso.
          </p>
        </div>

        <VenderForm />
      </div>
    </main>
  )
}
