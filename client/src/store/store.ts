// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
// Import your slices here
import cartReducer from './reducers/accountsSlice';
import userReducer from './reducers/cartSlice';
import accountsReducer from './reducers/accountsSlice';

const store:any = configureStore({
  reducer: {
    accounts: accountsReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
