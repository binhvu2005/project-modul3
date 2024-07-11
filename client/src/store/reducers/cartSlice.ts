import { createSlice } from '@reduxjs/toolkit';

export interface CartState { // Export this type
  items: number;
}

const initialState: CartState = {
  items: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state) {
      state.items += 1;
    },
    removeItem(state) {
      state.items -= 1;
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
