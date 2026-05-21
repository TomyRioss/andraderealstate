import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contacto | Andrade Real Estate',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] py-16 px-4">
      <div className="max-w-xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Contactanos</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Completa el formulario y nos ponemos en contacto a la brevedad.
        </p>
      </div>
      <ContactPageClient />
    </main>
  )
}
