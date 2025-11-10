import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variantId?: string
  variantName?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalAmount: () => number
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const itemKey = `${item.id}-${item.variantId || ''}`
          const existingIndex = state.items.findIndex(
            (i) => `${i.id}-${i.variantId || ''}` === itemKey
          )

          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += item.quantity || 1
            return { items: newItems }
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          }
        })
      },

      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && (item.variantId || '') === (variantId || ''))
          ),
        }))
      },

      updateQuantity: (id, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && (item.variantId || '') === (variantId || '')
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalAmount: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity
        }, 0)
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
