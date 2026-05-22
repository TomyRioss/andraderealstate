import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#18140D]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="lg:col-span-2 space-y-5">
            <Image
              src="/andrade_realstate_logo.png"
              alt="Andrade & Co Real Estate"
              width={180}
              height={80}
              className="brightness-[1.8]"
            />
            <p className="text-[#A89880] text-sm leading-relaxed max-w-xs font-light">
              Tu aliado de confianza en bienes raíces en México.
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7B68]">Síguenos en:</p>
            <div className="flex gap-5">
              <a href="#" aria-label="Facebook" className="text-[#8C7B68] hover:text-[#D4B896] transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-[#8C7B68] hover:text-[#D4B896] transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="TikTok" className="text-[#8C7B68] hover:text-[#D4B896] transition-colors">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7B68]">Propiedades</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'Venta', href: '/propiedades?contractType=SALE' },
                { label: 'Renta', href: '/propiedades?contractType=RENT' },
                { label: 'Desarrollos', href: '/propiedades?type=development' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-[#A89880] hover:text-[#D4B896] transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7B68]">Contacto</p>
            <div className="flex flex-col gap-2.5 text-sm text-[#A89880]">
              <span>+52 55 0000 0000</span>
              <span>contacto@andraderealestate.mx</span>
              <span>Ciudad de México, México</span>
            </div>
          </div>

        </div>

        <div className="mt-10 mb-0 text-left text-sm text-[#8C7B68]">
          Desarrollado por{' '}
          <a
            href="https://wa.me/5491134083140?text=Hola%2C%20me%20interesa%20desarrollar%20una%20idea."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D4B896] hover:underline transition-colors"
          >
            TTM Agencia
          </a>
          .
        </div>
      </div>

      <div className="border-t border-[#2E2820] py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#8C7B68]">
          <span>© {new Date().getFullYear()} Andrade & Co. Todos los derechos reservados.</span>
          <Link href="/admin" className="hover:text-[#D4B896] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
