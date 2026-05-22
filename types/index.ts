export type ContractType = 'SALE' | 'RENT' | 'DEVELOPMENT'
export type Category = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'DEVELOPMENT_PROJECT' | 'OTHER'
export type FormType = 'BUY' | 'SELL' | 'MANAGE'
export type LeadStatus = 'PENDING' | 'CONTACTED' | 'CLOSED' | 'DISCARDED'
export type TestimonialStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type Currency = 'MXN' | 'USD'

export interface Property {
  id: string
  title: string
  slug: string
  description: string
  address: string
  city: string
  state: string
  zipCode?: string | null
  lat?: number | null
  lng?: number | null
  contractType: ContractType
  category: Category
  priceMXN?: number | null
  priceUSD?: number | null
  priceVisible: boolean
  bedrooms?: number | null
  bathrooms?: number | null
  halfBaths?: number | null
  parkingSpots?: number | null
  areaSqm?: number | null
  landAreaSqm?: number | null
  floors?: number | null
  yearBuilt?: number | null
  photos: string[]
  videoUrl?: string | null
  mapsUrl?: string | null
  whatsapp?: string | null
  amenities: string[]
  features: string[]
  active: boolean
  featured: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ContactFormEntry {
  id: string
  type: FormType
  name?: string | null
  phone: string
  email: string
  address?: string | null
  photos: string[]
  status: LeadStatus
  notes?: string | null
  active: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Testimonial {
  id: string
  author: string
  location?: string | null
  rating: number
  content: string
  status: TestimonialStatus
  active: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
