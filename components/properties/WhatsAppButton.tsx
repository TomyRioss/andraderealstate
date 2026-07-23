'use client'

import { buildWhatsappLink } from '@/lib/whatsapp'

interface Props {
  phone?: string | null
  title: string
  url: string
}

export default function WhatsAppButton({ phone, title, url }: Props) {
  const resolvedPhone = phone || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || '523292965459'

  if (!resolvedPhone) return null

  const href = buildWhatsappLink(resolvedPhone, title, url)

  return (
    <>
      {/* Mobile: sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-4 bg-[#16a34a] text-white font-semibold text-base"
        >
          Consultar por WhatsApp
        </a>
      </div>

      {/* Desktop: regular button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center justify-center w-full py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg transition-colors"
      >
        Consultar por WhatsApp
      </a>
    </>
  )
}
