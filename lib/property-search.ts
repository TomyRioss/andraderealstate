import type { Property } from '@/types'

export interface PropertySearchFilters {
  activeOnly?: boolean | undefined
  contractType?: string | null | undefined
  category?: string | null | undefined
  city?: string | null | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  minBedrooms?: number | undefined
  bedrooms?: number | undefined
  featured?: boolean | undefined
  search?: string | null | undefined
}

export function filterProperties(properties: Property[], filters: PropertySearchFilters): Property[] {
  const normalizedCity = filters.city?.trim().toLocaleLowerCase()
  const normalizedSearch = filters.search?.trim().toLocaleLowerCase()

  return properties.filter((property) => {
    if (filters.activeOnly && !property.active) return false
    if (filters.contractType && property.contractType !== filters.contractType) return false
    if (filters.category && property.category !== filters.category) return false
    if (normalizedCity && !property.city?.toLocaleLowerCase().includes(normalizedCity)) return false
    if (filters.minBedrooms !== undefined && (property.bedrooms == null || property.bedrooms < filters.minBedrooms)) return false
    if (filters.bedrooms !== undefined && property.bedrooms !== filters.bedrooms) return false
    if (filters.minPrice !== undefined && (property.priceMXN == null || property.priceMXN < filters.minPrice)) return false
    if (filters.maxPrice !== undefined && (property.priceMXN == null || property.priceMXN > filters.maxPrice)) return false
    if (filters.featured !== undefined && property.featured !== filters.featured) return false

    if (normalizedSearch) {
      const searchableText = `${property.title ?? ''} ${property.description ?? ''} ${property.city ?? ''}`.toLocaleLowerCase()
      if (!searchableText.includes(normalizedSearch)) return false
    }

    return true
  })
}

export function sortByCreatedAtDescending<T extends { createdAt?: string | Date | null }>(records: T[]): T[] {
  return [...records].sort((left, right) => {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0
    return rightTime - leftTime
  })
}
