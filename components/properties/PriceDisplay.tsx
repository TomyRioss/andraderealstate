'use client'

import { useCurrency } from '@/lib/contexts/CurrencyContext'

interface Props {
  priceMXN?: number | null | undefined
  priceUSD?: number | null | undefined
  priceVisible: boolean
  sizeLg?: boolean
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

export default function PriceDisplay({ priceMXN, priceUSD, priceVisible, sizeLg = false }: Props) {
  const { currency } = useCurrency()

  if (!priceVisible) {
    return <p className="text-sm text-[#8C7B6B] italic">Precio a consultar</p>
  }

  const price = currency === 'USD' ? priceUSD : priceMXN
  if (price == null) return null

  return (
    <p className={`font-bold text-[#B07030] ${sizeLg ? 'text-3xl' : 'text-2xl'}`}>
      {formatPrice(price, currency)}{' '}
      <span className={`font-normal text-[#8C7B6B] ${sizeLg ? 'text-base' : 'text-sm'}`}>{currency}</span>
    </p>
  )
}
