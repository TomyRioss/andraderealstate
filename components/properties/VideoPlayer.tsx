'use client'

interface Props {
  videoUrl: string
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1] ?? null
  }
  return null
}

export default function VideoPlayer({ videoUrl }: Props) {
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const ytId = isYouTube ? extractYouTubeId(videoUrl) : null

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      {isYouTube && ytId ? (
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${ytId}`}
          title="Video de la propiedad"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full rounded-lg object-cover"
          controls
          src={videoUrl}
        >
          Tu navegador no soporta video.
        </video>
      )}
    </div>
  )
}
