import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contacto | Andrade Real Estate',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#E8F4FD] py-16 px-4">
      <div className="max-w-xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#0D3B66]">Contactanos</h1>
        <p className="mt-2 text-[#4A7BA7] text-sm">
          Completa el formulario y nos ponemos en contacto a la brevedad.
        </p>
      </div>
      <ContactPageClient />
    </main>
  )
}
