'use client'

interface Props {
  lat: number
  lng: number
  title: string
}

export default function PropertyMap({ lat, lng, title }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const coordinates = encodeURIComponent(`${lat},${lng}`)
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinates}`
    : `https://maps.google.com/maps?q=${coordinates}&z=16&output=embed`

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-lg border-0"
        src={src}
        title={`Mapa de ${title}`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
