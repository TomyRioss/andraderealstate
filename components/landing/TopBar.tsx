export default function TopBar() {
  return (
    <div className="bg-[#0f172a] text-white text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>55 1234 5678</span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="hidden sm:inline text-gray-300">contacto@andraderealestate.com</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
