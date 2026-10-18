'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export interface WeddingCartItem {
  itemId: string
  categoryName: string
  name: string
  imageUrl: string
  price: number
  unitLabel: string
  quantity: number
}

interface WeddingCartContextValue {
  items: WeddingCartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<WeddingCartItem, 'quantity'>) => void
  remove: (itemId: string) => void
  updateQty: (itemId: string, quantity: number) => void
  clear: () => void
  total: number
}

const STORAGE_KEY = 'wedding-cart'

const WeddingCartContext = createContext<WeddingCartContextValue>({
  items: [],
  isOpen: false,
  open: () => {},
  close: () => {},
  add: () => {},
  remove: () => {},
  updateQty: () => {},
  clear: () => {},
  total: 0,
})

export function WeddingCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WeddingCartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (err) {
      console.error('[WeddingCart] failed to read localStorage', err)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('[WeddingCart] failed to write localStorage', err)
    }
  }, [items, hydrated])

  const add: WeddingCartContextValue['add'] = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId)
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const remove = (itemId: string) =>
    setItems((prev) => prev.filter((i) => i.itemId !== itemId))

  const updateQty = (itemId: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.itemId !== itemId)
        : prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
    )

  const clear = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <WeddingCartContext.Provider
      value={{
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        add,
        remove,
        updateQty,
        clear,
        total,
      }}
    >
      {children}
    </WeddingCartContext.Provider>
  )
}

export const useWeddingCart = () => useContext(WeddingCartContext)
