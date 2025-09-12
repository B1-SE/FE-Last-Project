import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../types/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromStorage(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    incrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        state.items = state.items.filter(i => i.id !== action.payload);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  setCartFromStorage,
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
