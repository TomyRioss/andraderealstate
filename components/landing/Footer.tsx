import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Col 1 — Brand (spans 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <p className="font-black text-2xl tracking-widest text-white">ANDRADE</p>
              <p className="font-light text-white/60 text-sm">Real Estate</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Tu aliado de confianza en bienes raíces en México.
            </p>
            <div className="flex gap-5 pt-2">
              <a href="#" className="font-medium text-white/40 hover:text-white text-sm transition-colors">
                Facebook
              </a>
              <a href="#" className="font-medium text-white/40 hover:text-white text-sm transition-colors">
                Instagram
              </a>
              <a href="#" className="font-medium text-white/40 hover:text-white text-sm transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Col 2 — Propiedades */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Propiedades</p>
            <nav className="flex flex-col gap-2 text-sm text-white/50">
              <Link href="/propiedades?contractType=SALE" className="hover:text-white transition-colors">
                Venta
              </Link>
              <Link href="/propiedades?contractType=RENT" className="hover:text-white transition-colors">
                Renta
              </Link>
              <Link href="/propiedades?type=development" className="hover:text-white transition-colors">
                Desarrollos
              </Link>
            </nav>
          </div>

          {/* Col 3 — Empresa */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Empresa</p>
            <nav className="flex flex-col gap-2 text-sm text-white/50">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link>
              <Link href="/#contacto" className="hover:text-white transition-colors">Contacto</Link>
            </nav>
          </div>

          {/* Col 4 — Contacto */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Contacto</p>
            <div className="flex flex-col gap-2 text-sm text-white/50">
              <span>+52 55 0000 0000</span>
              <span>contacto@andraderealestate.mx</span>
              <span>Ciudad de México, México</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <span>© 2025 Andrade Real Estate. Todos los derechos reservados.</span>
          <Link href="/admin" className="hover:text-white/60 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
