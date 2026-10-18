import Image from 'next/image'
import Link from 'next/link'

const pillars = [
  {
    title: 'Arquitectura de Eventos',
    desc: 'Toldos monumentales y estructuras que definen el espacio con elegancia y seguridad.',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-8',
    height: 'h-[320px] md:h-[420px]',
  },
  {
    title: 'Mobiliario',
    desc: 'Curaduría de piezas únicas para crear ambientes íntimos.',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-4',
    height: 'h-[320px] md:h-[420px]',
  },
  {
    title: 'Cristalería',
    desc: 'Detalles que elevan la experiencia del comensal.',
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-4',
    height: 'h-[320px] md:h-[420px]',
  },
  {
    title: 'Catering de Autor',
    desc: 'Gastronomía diseñada para cautivar los sentidos y celebrar el momento.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-8',
    height: 'h-[320px] md:h-[420px]',
  },
]

export default function Pillars() {
  return (
    <section id="servicios" className="px-5 md:px-20 py-20 md:py-32 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl text-text-brand mb-6">La Maestría en el Detalle</h2>
          <p className="text-sm text-muted-brand">
            Cada elemento es seleccionado para armonizar con la visión de su evento, desde estructuras monumentales hasta la cristalería más fina.
          </p>
        </div>
        <div className="text-accent text-xs tracking-widest border-b border-accent/30 pb-2">NUESTROS PILARES</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {pillars.map((p) => (
          <Link
            key={p.title}
            href="/catalogo"
            className={`group relative overflow-hidden rounded-lg block ${p.height} ${p.span}`}
          >
            <Image
              src={p.img}
              alt={p.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <h3 className="font-display text-xl text-text-brand mb-2">{p.title}</h3>
              <p className="text-sm text-muted-brand max-w-md">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
