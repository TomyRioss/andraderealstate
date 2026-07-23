import type { Metadata } from 'next'
import { Phone, Mail, Globe } from 'lucide-react'
import ToldoCard from '@/components/toldos/ToldoCard'
import { toldos } from '@/lib/toldos-data'

export const metadata: Metadata = {
  title: 'Toldos | Grupo Chalita',
  description: 'Catálogo de toldos para eventos: árabes, luminosos, eurotent y estructuras de gran formato.',
}

export default function ToldosPage() {
  return (
    <main className="min-h-screen bg-[#111009] px-4 md:px-20 pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <span className="text-[#D4AF6B] text-xs font-semibold tracking-[0.3em] uppercase">Catálogo</span>
          <h1 className="font-semibold text-3xl md:text-5xl text-[#F5EDD8] leading-tight">Toldos</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toldos.map((toldo) => (
            <ToldoCard key={toldo.id} toldo={toldo} />
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 bg-[#1A1810] border border-[#2E2A18] rounded-2xl p-8">
          <h2 className="font-semibold text-xl text-[#F5EDD8]">Contáctanos</h2>
          <div className="flex flex-col gap-2 text-sm text-[#F5EDD8]/80">
            <span className="flex items-center gap-2">
              <Phone size={16} className="text-[#D4AF6B]" /> 3292965459
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-[#D4AF6B]" /> ventas@grupochalitabahia.com
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-[#D4AF6B]" /> kventas@grupochalitabahia.com
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-[#D4AF6B]" /> cventas@grupochalitabahia.com
            </span>
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-[#D4AF6B]" /> grupochalitabahia.com
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
