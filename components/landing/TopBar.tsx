export default function TopBar() {
  return (
    <div className="bg-[#18140D] text-xs">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5 text-[#E2D5C3] font-medium tracking-wide">
          <span>+52 55 1234 5678</span>
          <span className="hidden md:inline text-[#4A3F34]">·</span>
          <span className="hidden md:inline">contacto@andraderealestate.mx</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#C4B49E] font-medium">
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <span className="text-[#4A3F34]">·</span>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <span className="text-[#4A3F34]">·</span>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
