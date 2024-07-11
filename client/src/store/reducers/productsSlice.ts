// slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  nameProduct: string;
  description: string;
  price: number;
  img: string;
  // Add other fields if necessary
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  status: 'idle',
};

// Async thunk to fetch a single product by ID
export const fetchProduct:any = createAsyncThunk<Product, number>(
  'products/fetchProduct',
  async (productId) => {
    const response = await axios.get(`http://localhost:5000/products/${productId}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.status = 'failed';
        state.currentProduct = null;
      });
  },
});

export default productsSlice.reducer;
