'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export interface CategoryOption { value: string; label: string }

const CATS_SALE: CategoryOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'LAND', label: 'Terreno' },
]

const CATS_RENT: CategoryOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'COMMERCIAL', label: 'Oficina' },
]

function getCategoriesForType(type: string): CategoryOption[] | null {
  if (type === 'SALE') return CATS_SALE
  if (type === 'RENT') return CATS_RENT
  if (type === 'DEVELOPMENT') return null
  return [
    { value: 'HOUSE', label: 'Casa' },
    { value: 'APARTMENT', label: 'Departamento' },
    { value: 'LAND', label: 'Terreno' },
    { value: 'COMMERCIAL', label: 'Comercial / Oficina' },
  ]
}

export interface PropertyFiltersProps {
  contractType?: string | undefined
  category?: string | undefined
  city?: string | undefined
  minPrice?: string | undefined
  maxPrice?: string | undefined
  bedrooms?: string | undefined
  search?: string | undefined
  basePath?: string | undefined
  hiddenContractType?: string | undefined
  hiddenCategory?: string | undefined
  allowedCategories?: CategoryOption[] | undefined
}

export default function PropertyFilters({
  contractType = '',
  category = '',
  city = '',
  minPrice = '',
  maxPrice = '',
  bedrooms = '',
  search = '',
  basePath = '/propiedades',
  hiddenContractType,
  hiddenCategory,
}: PropertyFiltersProps) {
  const router = useRouter()

  const [searchVal, setSearchVal] = useState(search)
  const [cityVal, setCityVal] = useState(city)
  const [contractVal, setContractVal] = useState(contractType)
  const [categoryVal, setCategoryVal] = useState(category)
  const [minPriceVal, setMinPriceVal] = useState(minPrice)
  const [maxPriceVal, setMaxPriceVal] = useState(maxPrice)
  const [bedroomsVal, setBedroomsVal] = useState(bedrooms)

  const visibleCategories = getCategoriesForType(hiddenContractType ?? contractVal)

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
    router.push(qs ? `${basePath}?${qs}` : basePath)
  }

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => push({ search: searchVal }), 300)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal])

  useEffect(() => {
    if (cityTimer.current) clearTimeout(cityTimer.current)
    cityTimer.current = setTimeout(() => push({ city: cityVal }), 300)
    return () => { if (cityTimer.current) clearTimeout(cityTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityVal])

  function handleSelect(field: string, value: string) {
    if (field === 'contractType') {
      setContractVal(value)
      setCategoryVal('')
      push({ contractType: value, category: '' })
      return
    }
    if (field === 'category') setCategoryVal(value)
    if (field === 'bedrooms') setBedroomsVal(value)
    push({ [field]: value })
  }

  function handlePrice(field: 'minPrice' | 'maxPrice', value: string) {
    if (field === 'minPrice') setMinPriceVal(value)
    else setMaxPriceVal(value)
    push({ [field]: value })
  }

  const inputCls = 'border border-[#E0D9CF] bg-white rounded-lg px-3 py-2 text-sm text-[#18140D] outline-none focus:ring-2 focus:ring-[#B07030] placeholder:text-[#A89880]'
  const labelCls = 'text-xs font-medium text-[#8C7B68] mb-1'

  return (
    <div className="w-full bg-white border border-[#E8E2D9] rounded-xl p-4 space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-3 md:items-end">
      {/* Search */}
      <div className="flex flex-col flex-1 min-w-[160px]">
        <label className={labelCls}>Buscar</label>
        <input
          type="text"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Título, dirección..."
          className={inputCls}
        />
      </div>

      {/* Contract type — hidden if locked by sub-page */}
      {!hiddenContractType && (
        <div className="flex flex-col min-w-[140px]">
          <label className={labelCls}>Tipo</label>
          <select
            value={contractVal}
            onChange={e => handleSelect('contractType', e.target.value)}
            className={inputCls}
          >
            <option value="">Todos</option>
            <option value="SALE">Venta</option>
            <option value="RENT">Renta</option>
            <option value="DEVELOPMENT">Desarrollo</option>
          </select>
        </div>
      )}

      {/* Category — hidden if locked, hidden for DEVELOPMENT type */}
      {!hiddenCategory && visibleCategories !== null && (
        <div className="flex flex-col min-w-[150px]">
          <label className={labelCls}>Categoría</label>
          <select
            value={categoryVal}
            onChange={e => handleSelect('category', e.target.value)}
            className={inputCls}
          >
            <option value="">Todas</option>
            {visibleCategories.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* City */}
      <div className="flex flex-col min-w-[130px]">
        <label className={labelCls}>Ciudad</label>
        <input
          type="text"
          value={cityVal}
          onChange={e => setCityVal(e.target.value)}
          placeholder="Ciudad..."
          className={inputCls}
        />
      </div>

      {/* Price range */}
      <div className="flex flex-col min-w-[120px]">
        <label className={labelCls}>Precio mín.</label>
        <input
          type="number"
          value={minPriceVal}
          onChange={e => handlePrice('minPrice', e.target.value)}
          placeholder="0"
          className={inputCls}
        />
      </div>

      <div className="flex flex-col min-w-[120px]">
        <label className={labelCls}>Precio máx.</label>
        <input
          type="number"
          value={maxPriceVal}
          onChange={e => handlePrice('maxPrice', e.target.value)}
          placeholder="∞"
          className={inputCls}
        />
      </div>

      {/* Bedrooms */}
      <div className="flex flex-col min-w-[110px]">
        <label className={labelCls}>Recámaras</label>
        <select
          value={bedroomsVal}
          onChange={e => handleSelect('bedrooms', e.target.value)}
          className={inputCls}
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
          className="border-[#E8E2D9] text-[#5C5047] hover:bg-[#18140D] hover:text-white hover:border-[#18140D] text-sm"
          onClick={() => {
            setSearchVal('')
            setCityVal('')
            setContractVal('')
            setCategoryVal('')
            setMinPriceVal('')
            setMaxPriceVal('')
            setBedroomsVal('')
            router.push(basePath)
          }}
        >
          Limpiar
        </Button>
      </div>
    </div>
  )
}
