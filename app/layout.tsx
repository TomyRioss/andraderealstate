import type { Metadata } from 'next'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Andrade Real Estate',
  description: 'Inmobiliaria en México — compra, venta y renta de propiedades.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn('h-full antialiased font-sans', manrope.variable, playfair.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
