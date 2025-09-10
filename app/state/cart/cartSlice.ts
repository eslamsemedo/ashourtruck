import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'



interface CartState {
  items: Array<{
    id: string,
    name: string,
    price: number,
    quantity: number,
  }>,
  total: number,
  quantity: number,
}

const initialState: CartState = {
  items: [],
  total: 0,
  quantity: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
      state.total += action.payload.price * action.payload.quantity
      state.quantity += action.payload.quantity
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id)
      state.total -= action.payload.price * action.payload.quantity
      state.quantity -= action.payload.quantity
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemAsync.pending, (state, action) => {
        // state.items.push(action.payload)
        // state.total += action.payload.price * action.payload.quantity
        // state.quantity += action.payload.quantity
        console.log("pending")
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.total += action.payload.price * action.payload.quantity
        state.quantity += action.payload.quantity
      })
  }
})

export const addItemAsync = createAsyncThunk(
  "cart/addItemAsync",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id: "1", name: "Item 1", price: 10, quantity: 1 };
  }
);

export const { addItem } = cartSlice.actions
export default cartSlice.reducer