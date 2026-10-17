export default function TopBar() {
  return (
    <div className="bg-[#0D1A2D] text-xs text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-4 font-medium tracking-wide">
          <a href="tel:+5213221682424" className="shrink-0 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]">
            +52 132 2168 2424
          </a>
          <span aria-hidden="true" className="hidden text-[#B3B3B3] md:inline">·</span>
          <a href="mailto:rentasysolucionnes@gmail.com" className="hidden truncate underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3] md:inline">
            rentasysolucionnes@gmail.com
          </a>
        </div>

        <nav aria-label="Redes sociales" className="hidden shrink-0 items-center gap-4 text-[#B3B3B3] md:flex">
          <a
            href="https://www.facebook.com/AndradeSolucionesInmobilirias?mibextid=wwXIfr&rdid=Yz1nSfqzbFbeB57N&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GeFWv6wXX%2F%3Fmibextid%3DwwXIfr#"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
          >
            Facebook
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.tiktok.com/@claudiaandradde"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
          >
            TikTok
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://api.whatsapp.com/message/52PNLUOHBGDLH1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3B3B3]"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </div>
  )
}
