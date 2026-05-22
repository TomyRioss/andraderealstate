import Link from 'next/link'

export default function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-[#F5F0E8]">
      {/* Editorial header */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#D4C4A8] pb-10 gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B07030] font-bold">
              Contacto
            </span>
            <h2
              className="mt-3 text-5xl md:text-6xl lg:text-7xl font-bold text-[#18140D] leading-[1.05]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              ¿Listo para<br />
              <em className="italic font-normal">el siguiente paso?</em>
            </h2>
          </div>
          <p className="text-[#8C7B6B] text-sm leading-relaxed md:text-right md:max-w-[200px] md:pb-2">
            Te contactamos en<br className="hidden md:block" />
            menos de 24 horas.
          </p>
        </div>
      </div>

      {/* Photo cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Comprar */}
          <Link
            href="/comprar"
            className="group relative overflow-hidden rounded-3xl block"
            style={{ height: '480px' }}
          >
            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
              alt="Comprar propiedad"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906]/90 via-[#0D0906]/25 to-transparent" />
            {/* Hover tint */}
            <div className="absolute inset-0 bg-[#B07030]/0 group-hover:bg-[#B07030]/10 transition-colors duration-500" />

            {/* Top pill */}
            <div className="absolute top-7 left-7">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-semibold border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
                Comprar
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Encuentra tu<br />
                <em className="italic font-normal">propiedad ideal</em>
              </h3>
              <span className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.15em] uppercase text-white bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2.5 transition-all duration-300 group-hover:bg-[#B07030] group-hover:border-[#B07030]">
                Quiero Comprar
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
              </span>
            </div>
          </Link>

          {/* Vender */}
          <Link
            href="/vender"
            className="group relative overflow-hidden rounded-3xl block"
            style={{ height: '480px' }}
          >
            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
              alt="Vender propiedad"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906]/90 via-[#0D0906]/25 to-transparent" />
            {/* Hover tint */}
            <div className="absolute inset-0 bg-[#B07030]/0 group-hover:bg-[#B07030]/10 transition-colors duration-500" />

            {/* Top pill */}
            <div className="absolute top-7 left-7">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-semibold border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
                Vender
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Vende sin<br />
                <em className="italic font-normal">contratiempos</em>
              </h3>
              <span className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.15em] uppercase text-white bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2.5 transition-all duration-300 group-hover:bg-[#B07030] group-hover:border-[#B07030]">
                Quiero Vender
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
              </span>
            </div>
          </Link>

          {/* Administrar */}
          <Link
            href="/administrar"
            className="group relative overflow-hidden rounded-3xl block"
            style={{ height: '480px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
              alt="Administrar propiedad"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0906]/90 via-[#0D0906]/25 to-transparent" />
            <div className="absolute inset-0 bg-[#B07030]/0 group-hover:bg-[#B07030]/10 transition-colors duration-500" />

            <div className="absolute top-7 left-7">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-semibold border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
                Administrar
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Administra sin<br />
                <em className="italic font-normal">preocupaciones</em>
              </h3>
              <span className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.15em] uppercase text-white bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2.5 transition-all duration-300 group-hover:bg-[#B07030] group-hover:border-[#B07030]">
                Quiero Administrar
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Contact bar */}
        <div className="mt-10 pt-8 border-t border-[#D4C4A8] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
          <a
            href="tel:+525500000000"
            className="group flex flex-col items-center sm:items-start gap-0.5"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7B6B] font-bold">
              Teléfono
            </span>
            <span className="text-[#18140D] font-semibold text-base group-hover:text-[#B07030] transition-colors">
              +52 132 2168 2424
            </span>
          </a>

          <div className="hidden sm:block w-px h-10 bg-[#D4C4A8]" />

          <a
            href="mailto:rentasysolucionnes@gmail.com"
            className="group flex flex-col items-center sm:items-start gap-0.5"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C7B6B] font-bold">
              Email
            </span>
            <span className="text-[#18140D] font-semibold text-base group-hover:text-[#B07030] transition-colors">
              rentasysolucionnes@gmail.com
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
