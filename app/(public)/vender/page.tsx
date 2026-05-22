import { Metadata } from 'next'
import Link from 'next/link'
import VenderForm from '@/components/contact/VenderForm'

export const metadata: Metadata = {
  title: 'Vender | Andrade Real Estate',
  description: 'Vende tu propiedad con la asesoría de Andrade Real Estate.',
}

export default function VenderPage() {
  return (
    <main className="min-h-screen bg-[#F5F0EA] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[#8C7B68] hover:text-[#C9A96E] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Vender
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#18140D] mb-3">
            Vende tu propiedad sin contratiempos
          </h1>
          <p className="text-[#8C7B68] text-base leading-relaxed">
            Cargá tu propiedad y te contactamos para comenzar el proceso.
          </p>
        </div>

        <VenderForm />
      </div>
    </main>
  )
}
