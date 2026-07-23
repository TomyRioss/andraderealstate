'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'
import WeddingCartPanel from './WeddingCartPanel'

export default function WeddingCartDrawer() {
  const { isOpen, close } = useWeddingCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-surface border-border-brand flex flex-col overflow-y-auto p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>Tu Plan de Boda</SheetTitle>
        </SheetHeader>
        <WeddingCartPanel />
      </SheetContent>
    </Sheet>
  )
}
