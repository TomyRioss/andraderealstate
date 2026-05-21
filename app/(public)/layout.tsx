import { ReactNode } from 'react'
import { CurrencyProvider } from '@/lib/contexts/CurrencyContext'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
