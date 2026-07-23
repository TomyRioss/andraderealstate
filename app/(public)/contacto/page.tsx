import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contacto | Grupo Chalita',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#1A1810] py-16 px-4">
      <div className="max-w-xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#F5EDD8]">Contactanos</h1>
        <p className="mt-2 text-[#7A6845] text-sm">
          Completa el formulario y nos ponemos en contacto a la brevedad.
        </p>
      </div>
      <ContactPageClient />
    </main>
  )
}
