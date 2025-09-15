import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

// Cart item stored in Redux
export type CartItem = {
  id: number | string,
  name: string,
  image: string,
  price: number, // unit price applied at time of add/update
  qty: number,
  category?: string,
  weight?: number,
  sku?: string,
}

export type CartState = {
  items: CartItem[],
  coupon: string | null,
  discount: number, // absolute discount value applied to subtotal
  currency: string,
}

const initialState: CartState = {
  items: [],
  coupon: null,
  discount: 0,
  currency: 'USD',
}

const findItemIndexById = (items: CartItem[], id: CartItem['id']) => items.findIndex(i => i.id === id)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload
      const idx = findItemIndexById(state.items, payload.id)
      if (idx >= 0) {
        // Merge quantities and update price to latest unit price
        state.items[idx].qty += payload.qty
        state.items[idx].price = payload.price
        // Keep other fields up-to-date
        state.items[idx].name = payload.name
        state.items[idx].image = payload.image
        state.items[idx].category = payload.category
        state.items[idx].weight = payload.weight
        state.items[idx].sku = payload.sku
      } else {
        state.items.push(payload)
      }
    },
    incrementQty: (state, action: PayloadAction<CartItem['id']>) => {
      const idx = findItemIndexById(state.items, action.payload)
      if (idx >= 0) state.items[idx].qty += 1
    },
    decrementQty: (state, action: PayloadAction<CartItem['id']>) => {
      const idx = findItemIndexById(state.items, action.payload)
      if (idx >= 0) state.items[idx].qty = Math.max(1, state.items[idx].qty - 1)
    },
    setQty: (state, action: PayloadAction<{ id: CartItem['id'], qty: number }>) => {
      const { id, qty } = action.payload
      const idx = findItemIndexById(state.items, id)
      if (idx >= 0) state.items[idx].qty = Math.max(1, Math.min(9999, Math.floor(qty)))
    },
    updateLinePrice: (state, action: PayloadAction<{ id: CartItem['id'], price: number }>) => {
      const { id, price } = action.payload
      const idx = findItemIndexById(state.items, id)
      if (idx >= 0) state.items[idx].price = price
    },
    removeItem: (state, action: PayloadAction<CartItem['id']>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
      state.coupon = null
      state.discount = 0
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      // Placeholder coupon logic: 10% off for code SAVE10
      const code = action.payload.trim().toUpperCase()
      state.coupon = code
      if (code === 'SAVE10') {
        // discount is derived at selector time usually; here keep simple flat marker
        // We'll set a nominal discount and let selectors clamp it
        state.discount = 0.10
      } else {
        state.discount = 0
      }
    }
  }
})

export const { addItem, incrementQty, decrementQty, setQty, updateLinePrice, removeItem, clearCart, applyCoupon } = cartSlice.actions

export default cartSlice.reducer

// Selectors
export type RootLike = { cart: CartState }

export const selectCartItems = (state: RootLike) => state.cart.items

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, it) => sum + it.qty, 0)
)

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, it) => sum + it.qty * it.price, 0)
)
