import type { Metadata } from 'next'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
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
  title: 'Andrade & Co Real Estate',
  description: 'Estructuramos y acompañamos operaciones inmobiliarias y comerciales con un enfoque estratégico y preventivo.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn('h-full antialiased font-sans', poppins.variable)}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-medium">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
