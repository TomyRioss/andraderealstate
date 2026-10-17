import { Metadata } from 'next'
import Link from 'next/link'
import VenderForm from '@/components/contact/VenderForm'

export const metadata: Metadata = {
  title: 'Vender | Andrade & Co Real Estate',
  description: 'Acompañamiento preventivo y profesional para estructurar la venta de tu propiedad.',
}

export default function VenderPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] py-16 px-6">
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
            Vender o rentar
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0D1A2D] mb-3">
            Vende o renta con respaldo profesional
          </h1>
          <p className="text-[#525252] text-base leading-relaxed">
            Comparte los datos de tu propiedad para analizar contigo los siguientes pasos.
          </p>
        </div>

        <VenderForm />
      </div>
    </main>
  )
}
