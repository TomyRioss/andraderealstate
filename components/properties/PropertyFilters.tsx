'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export interface PropertyFiltersProps {
  contractType?: string | undefined
  category?: string | undefined
  city?: string | undefined
  minPrice?: string | undefined
  maxPrice?: string | undefined
  bedrooms?: string | undefined
  search?: string | undefined
}

export default function PropertyFilters({
  contractType = '',
  category = '',
  city = '',
  minPrice = '',
  maxPrice = '',
  bedrooms = '',
  search = '',
}: PropertyFiltersProps) {
  const router = useRouter()

  const [searchVal, setSearchVal] = useState(search)
  const [cityVal, setCityVal] = useState(city)
  const [contractVal, setContractVal] = useState(contractType)
  const [categoryVal, setCategoryVal] = useState(category)
  const [minPriceVal, setMinPriceVal] = useState(minPrice)
  const [maxPriceVal, setMaxPriceVal] = useState(maxPrice)
  const [bedroomsVal, setBedroomsVal] = useState(bedrooms)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function buildParams(overrides: Record<string, string> = {}) {
    const base: Record<string, string> = {
      contractType: contractVal,
      category: categoryVal,
      city: cityVal,
      minPrice: minPriceVal,
      maxPrice: maxPriceVal,
      bedrooms: bedroomsVal,
      search: searchVal,
    }
    const merged = { ...base, ...overrides }
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v)
    }
    return params.toString()
  }

  function push(overrides: Record<string, string> = {}) {
    const qs = buildParams(overrides)
    router.push(qs ? `/propiedades?${qs}` : '/propiedades')
  }

  // debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => push({ search: searchVal }), 300)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal])

  // debounced city
  useEffect(() => {
    if (cityTimer.current) clearTimeout(cityTimer.current)
    cityTimer.current = setTimeout(() => push({ city: cityVal }), 300)
    return () => { if (cityTimer.current) clearTimeout(cityTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityVal])

  function handleSelect(field: string, value: string) {
    const map: Record<string, () => void> = {
      contractType: () => setContractVal(value),
      category: () => setCategoryVal(value),
      bedrooms: () => setBedroomsVal(value),
    }
    map[field]?.()
    push({ [field]: value })
  }

  function handlePrice(field: 'minPrice' | 'maxPrice', value: string) {
    if (field === 'minPrice') setMinPriceVal(value)
    else setMaxPriceVal(value)
    push({ [field]: value })
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-3 md:items-end">
      {/* Search */}
      <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-gray-600">Buscar</label>
        <input
          type="text"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Título, dirección..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        />
      </div>

      {/* Contract type */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-medium text-gray-600">Tipo</label>
        <select
          value={contractVal}
          onChange={e => handleSelect('contractType', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        >
          <option value="">Todos</option>
          <option value="SALE">Venta</option>
          <option value="RENT">Renta</option>
          <option value="DEVELOPMENT">Desarrollo</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="text-xs font-medium text-gray-600">Categoría</label>
        <select
          value={categoryVal}
          onChange={e => handleSelect('category', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        >
          <option value="">Todas</option>
          <option value="HOUSE">Casa</option>
          <option value="APARTMENT">Departamento</option>
          <option value="LAND">Terreno</option>
          <option value="COMMERCIAL">Comercial</option>
          <option value="DEVELOPMENT_PROJECT">Desarrollo</option>
          <option value="OTHER">Otro</option>
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1 min-w-[130px]">
        <label className="text-xs font-medium text-gray-600">Ciudad</label>
        <input
          type="text"
          value={cityVal}
          onChange={e => setCityVal(e.target.value)}
          placeholder="Ciudad..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        />
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-1 min-w-[120px]">
        <label className="text-xs font-medium text-gray-600">Precio mín.</label>
        <input
          type="number"
          value={minPriceVal}
          onChange={e => handlePrice('minPrice', e.target.value)}
          placeholder="0"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[120px]">
        <label className="text-xs font-medium text-gray-600">Precio máx.</label>
        <input
          type="number"
          value={maxPriceVal}
          onChange={e => handlePrice('maxPrice', e.target.value)}
          placeholder="∞"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        />
      </div>

      {/* Bedrooms */}
      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className="text-xs font-medium text-gray-600">Recámaras</label>
        <select
          value={bedroomsVal}
          onChange={e => handleSelect('bedrooms', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        >
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Clear */}
      <div className="flex items-end">
        <Button
          variant="outline"
          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white text-sm"
          onClick={() => {
            setSearchVal('')
            setCityVal('')
            setContractVal('')
            setCategoryVal('')
            setMinPriceVal('')
            setMaxPriceVal('')
            setBedroomsVal('')
            router.push('/propiedades')
          }}
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
