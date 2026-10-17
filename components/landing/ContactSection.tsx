import Link from 'next/link'

const services = [
  {
    label: 'Comprar',
    href: '/comprar',
    title: 'Encuentra una propiedad alineada a tus objetivos.',
    action: 'Explorar opciones',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Casa contemporánea con jardín',
  },
  {
    label: 'Vender o rentar',
    href: '/vender',
    title: 'Concreta la operación con respaldo.',
    action: 'Solicitar asesoría',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    alt: 'Interior residencial iluminado',
  },
  {
    label: 'Administrar',
    href: '/administrar',
    title: 'Protege el valor de tu propiedad.',
    action: 'Conocer el servicio',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Acceso de una propiedad residencial',
  },
]

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-[#0D1A2D] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 border-b border-[#B3B3B3] pb-9 md:grid-cols-[1fr_16rem] md:items-end md:gap-12 md:pb-12">
          <h2 className="font-display max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            ¿Necesitas orientación para tu siguiente paso?
          </h2>
          <p className="max-w-sm text-base leading-7 text-[#B3B3B3] md:pb-1">
            Recibe asesoría inmobiliaria, comercial y jurídica para estructurar tu operación.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group relative block min-h-[410px] overflow-hidden border border-[#B3B3B3] bg-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3] sm:min-h-[460px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[#0D1A2D]/20 transition-colors group-hover:bg-[#0D1A2D]/10" />
              <span className="absolute left-0 top-0 bg-[#0D1A2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B3B3B3]">
                {service.label}
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-[#0D1A2D] p-6 sm:p-7">
                <h3 className="font-display max-w-sm text-2xl font-medium leading-snug sm:text-3xl">
                  {service.title}
                </h3>
                <span className="mt-6 inline-flex items-center gap-3 border-b border-[#B3B3B3] pb-2 text-sm font-semibold text-white transition-colors group-hover:text-[#B3B3B3]">
                  {service.action} <span aria-hidden="true" className="text-lg">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-[#B3B3B3] pt-7 sm:grid-cols-2 sm:gap-10">
          <a
            href="tel:+5213221682424"
            className="group flex flex-col items-start gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Teléfono</span>
            <span className="text-lg font-medium text-white underline decoration-transparent underline-offset-4 transition-colors group-hover:text-[#B3B3B3] group-hover:decoration-[#B3B3B3]">
              +52 132 2168 2424
            </span>
          </a>
          <a
            href="mailto:rentasysolucionnes@gmail.com"
            className="group flex flex-col items-start gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Correo electrónico</span>
            <span className="break-all text-lg font-medium text-white underline decoration-transparent underline-offset-4 transition-colors group-hover:text-[#B3B3B3] group-hover:decoration-[#B3B3B3]">
              rentasysolucionnes@gmail.com
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
