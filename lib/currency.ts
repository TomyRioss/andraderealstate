export type Currency = 'MXN' | 'USD'

export function formatPrice(priceMXN: number, currency: Currency, usdRate = 17.5): string {
  const amount = currency === 'USD' ? priceMXN / usdRate : priceMXN
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
