'use client'

import { usePathname } from 'next/navigation'

const WHATSAPP_NUMBER = '5213221682424'

export default function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1ebe5d] transition-colors"
    >
      <svg viewBox="0 0 32 32" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.482.676 4.807 1.853 6.8L2 30l7.4-1.82A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.82-1.587l-.418-.247-4.39 1.08 1.1-4.27-.27-.44A11.46 11.46 0 0 1 4.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5zm6.29-8.61c-.345-.173-2.04-1.006-2.356-1.12-.316-.115-.546-.173-.776.173-.23.345-.89 1.12-1.09 1.35-.2.23-.4.26-.745.086-.345-.173-1.456-.537-2.773-1.71-1.025-.914-1.717-2.043-1.918-2.388-.2-.345-.021-.532.15-.704.155-.155.345-.403.518-.604.172-.202.23-.345.345-.576.115-.23.058-.432-.029-.604-.086-.173-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.59l-.662-.011c-.23 0-.604.086-.92.432-.316.345-1.205 1.178-1.205 2.872 0 1.695 1.234 3.332 1.406 3.562.173.23 2.43 3.71 5.887 5.203.823.355 1.465.567 1.965.726.826.263 1.578.226 2.172.137.663-.1 2.04-.834 2.328-1.638.287-.805.287-1.494.2-1.638-.086-.144-.316-.23-.66-.403z" />
      </svg>
    </a>
  )
}
