import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa'

const navigationLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Venta', href: '/propiedades?contractType=SALE' },
  { label: 'Renta', href: '/propiedades?contractType=RENT' },
  { label: 'Estancias vacacionales', href: '/propiedades?category=VACATION_STAY' },
  { label: 'Desarrollos', href: '/propiedades?type=development' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0D1A2D] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 border-b border-[#B3B3B3] pb-12 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Andrade & Co Real Estate, inicio" className="inline-flex h-[114px] w-[190px] items-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]">
              <Image
                src="/logo-kw-bahia-fullcolor.png"
                alt="Keller Williams Bahia Bienes Raíces"
                width={2060}
                height={1237}
                className="h-auto w-[190px]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#B3B3B3]">
              Asesoría estratégica y acompañamiento preventivo en cada operación inmobiliaria.
            </p>
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Redes sociales</p>
              <div className="flex items-center gap-5">
                <a
                  href="https://www.facebook.com/AndradeSolucionesInmobilirias?mibextid=wwXIfr&rdid=Yz1nSfqzbFbeB57N&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GeFWv6wXX%2F%3Fmibextid%3DwwXIfr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[#B3B3B3] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
                >
                  <FaFacebook size={18} aria-hidden="true" />
                </a>
                <a
                  href="https://www.tiktok.com/@claudiaandradde"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-[#B3B3B3] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
                >
                  <FaTiktok size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Navegación</h2>
            <nav aria-label="Navegación del sitio" className="flex flex-col items-start gap-3">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white underline decoration-transparent underline-offset-4 transition-colors hover:text-[#B3B3B3] hover:decoration-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#B3B3B3]">Contacto</h2>
            <div className="flex flex-col items-start gap-3 text-sm text-white">
              <a
                href="https://api.whatsapp.com/message/52PNLUOHBGDLH1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white transition-colors hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
              >
                <FaWhatsapp size={15} aria-hidden="true" />
                +52 132 2168 2424
              </a>
              <a href="mailto:rentasysolucionnes@gmail.com" className="break-all transition-colors hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]">
                rentasysolucionnes@gmail.com
              </a>
              <span>Ciudad de México, México</span>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-col gap-4 text-xs text-[#B3B3B3] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Andrade & Co. Todos los derechos reservados.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:contents">
            <span className="sm:absolute sm:left-1/2 sm:-translate-x-1/2">
              Desarrollado por{' '}
              <a
                href="https://wa.me/5491134083140?text=Hola%2C%20me%20interesa%20desarrollar%20una%20idea."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-[#B3B3B3] underline-offset-4 hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
              >
                TTM Agencia
              </a>
            </span>
            <Link href="/admin/login" className="text-white underline decoration-[#B3B3B3] underline-offset-4 hover:text-[#B3B3B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3] sm:ml-auto">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
