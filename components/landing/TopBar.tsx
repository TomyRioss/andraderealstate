export default function TopBar() {
  return (
    <div className="bg-[#18140D] text-xs">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5 text-[#E2D5C3] font-medium tracking-wide">
          <span>+52 132 2168 2424</span>
          <span className="hidden md:inline text-[#4A3F34]">·</span>
          <span className="hidden md:inline">rentasysolucionnes@gmail.com</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#C4B49E] font-medium">
          <a href="https://www.facebook.com/AndradeSolucionesInmobilirias?mibextid=wwXIfr&rdid=Yz1nSfqzbFbeB57N&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GeFWv6wXX%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
          <span className="text-[#4A3F34]">·</span>
          <a href="https://www.tiktok.com/@claudiaandradde" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
          <span className="text-[#4A3F34]">·</span>
          <a href="https://api.whatsapp.com/message/52PNLUOHBGDLH1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
