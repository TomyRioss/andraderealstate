'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  mapsUrl?: string | null
}

export default function PropertyMap({ lat, lng, mapsUrl }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    let map: import('leaflet').Map | null = null

    if (!document.querySelector('#leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then((L) => {
      // Fix default icon paths broken by bundlers
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if ((ref.current as HTMLElement & { _leaflet_id?: number })._leaflet_id) return
      map = L.map(ref.current!, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      const marker = L.marker([lat, lng]).addTo(map)

      if (mapsUrl) {
        marker.on('click', () => window.open(mapsUrl, '_blank'))
        map.on('click', () => window.open(mapsUrl, '_blank'))
        ref.current!.style.cursor = 'pointer'
      }
    })

    return () => {
      map?.remove()
    }
  }, [lat, lng, mapsUrl])

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#E5DDD5]">
      <div ref={ref} className="w-full h-64" />
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white shadow border border-[#E5DDD5] text-[#18140D] hover:bg-[#FAF8F5] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          Ver en Google Maps
        </a>
      )}
    </div>
  )
}
