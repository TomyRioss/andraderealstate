import { ImageOff } from 'lucide-react'
import type { Toldo } from '@/lib/toldos-data'

export default function ToldoCard({ toldo }: { toldo: Toldo }) {
  return (
    <article className="flex flex-col bg-[#1A1810] border border-[#2E2A18] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-center h-48 bg-[#111009] border-b border-[#2E2A18] text-[#7A6845]">
        <ImageOff size={32} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div>
          <h2 className="font-semibold text-lg text-[#F5EDD8]">{toldo.nombre}</h2>
          {toldo.subtitulo && (
            <p className="text-[#D4AF6B] text-xs font-semibold tracking-wide uppercase mt-1">
              {toldo.subtitulo}
            </p>
          )}
        </div>
        <p className="text-[#F5EDD8]/80 text-sm leading-relaxed">{toldo.descripcion}</p>
        <p className="text-[#7A6845] text-xs">
          <span className="font-semibold text-[#B8912A]">Medidas: </span>
          {toldo.medidas}
        </p>
        <ul className="flex flex-col gap-1.5 mt-1">
          {toldo.caracteristicas.map((c) => (
            <li key={c} className="text-[#F5EDD8]/70 text-xs flex gap-2">
              <span className="text-[#D4AF6B]">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
