'use client'
import { createContext, useContext, useState } from 'react'
import type { Currency } from '@/types'

interface CurrencyContextValue {
  currency: Currency
  toggle: () => void
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'MXN',
  toggle: () => {},
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('MXN')
  const toggle = () => setCurrency(c => c === 'MXN' ? 'USD' : 'MXN')
  return <CurrencyContext.Provider value={{ currency, toggle }}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => useContext(CurrencyContext)
