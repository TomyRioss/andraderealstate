import { Tent, Armchair, Wine, Layers, Utensils, Music, Sparkles, type LucideIcon } from 'lucide-react'

export const weddingIconMap: Record<string, LucideIcon> = {
  tent: Tent,
  armchair: Armchair,
  chair: Armchair,
  wine: Wine,
  wine_bar: Wine,
  layers: Layers,
  utensils: Utensils,
  restaurant: Utensils,
  music: Music,
  straighten: Music,
}

export function getWeddingIcon(icon: string | null | undefined): LucideIcon {
  return weddingIconMap[icon ?? ''] ?? Sparkles
}
