import { ReactNode } from 'react'
import { CurrencyProvider } from '@/lib/contexts/CurrencyContext'
import { WeddingCartProvider } from '@/lib/contexts/WeddingCartContext'
import WeddingCartDrawer from '@/components/wedding/WeddingCartDrawer'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <WeddingCartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <WeddingCartDrawer />
      </WeddingCartProvider>
    </CurrencyProvider>
  )
}
