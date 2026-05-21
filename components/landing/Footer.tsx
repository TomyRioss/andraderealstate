import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-12 pb-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-sans tracking-wide">Andrade Real Estate</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu aliado de confianza en bienes raíces. Compra, renta o vende con respaldo profesional.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-300">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Tel: +52 (55) 0000-0000</li>
              <li>contacto@andraderealestate.mx</li>
              <li>Ciudad de México, México</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-300">Navegación</h4>
            <nav className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/propiedades" className="hover:text-white transition">Propiedades</Link>
              <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
              <Link href="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition">Admin</Link>
            </nav>
          </div>
        </div>

        {/* Social + copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">WhatsApp</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Andrade Real Estate. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
