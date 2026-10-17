import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contacto | Andrade & Co Real Estate',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] py-16 px-4">
      <div className="max-w-xl mx-auto mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-[#0D1A2D]">Contáctanos</h1>
        <p className="mt-2 text-[#525252] text-sm">
          Comparte los detalles de tu consulta para recibir orientación de nuestro equipo.
        </p>
      </div>
      <ContactPageClient />
    </main>
  )
}
