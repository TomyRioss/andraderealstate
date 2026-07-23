'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  photos: string[]
  title: string
}

export default function PhotoGallery({ photos, title }: Props) {
  const [active, setActive] = useState(0)

  if (!photos.length) {
    return (
      <div className="w-full h-64 bg-[#1A1810] flex items-center justify-center rounded-lg text-[#7A6845]">
        Sin fotos disponibles
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main photo */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-[#1A1810]">
        <Image
          src={photos[active] as string}
          alt={`${title} - foto ${active + 1}`}
          fill
          sizes="(max-width:768px) 100vw, 60vw"
          className="object-cover"
          priority={active === 0}
        />
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex md:grid md:grid-cols-6 gap-2 overflow-x-auto pb-1 md:overflow-visible">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-full md:h-16 rounded overflow-hidden border-2 transition-colors ${
                i === active ? 'border-[#10b981]' : 'border-transparent'
              }`}
            >
              <Image
                src={src}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
