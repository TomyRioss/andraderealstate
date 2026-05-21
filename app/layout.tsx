import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="es" className={cn('h-full antialiased font-sans', poppins.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
