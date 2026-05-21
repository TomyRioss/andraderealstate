import { ReactNode } from 'react'
import { CurrencyProvider } from '@/lib/contexts/CurrencyContext'
import TopBar from '@/components/landing/TopBar'
import Header from '@/components/landing/Header'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <TopBar />
      <Header />
      {children}
    </CurrencyProvider>
  )
}
