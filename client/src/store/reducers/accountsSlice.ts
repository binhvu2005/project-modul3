import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { json } from 'react-router-dom';

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  password: string;
  lock: string;
  status: number;
  img: string;
  cart: any[];
  address: string;
}

interface AccountsState {
  accounts: Account[];
  currentUser: Account | null;
}

const initialState: AccountsState = {
  accounts: [],
  currentUser: null,
};

// Async thunk to fetch accounts data
export const fetchAccounts: any = createAsyncThunk<Account[]>(
  'accounts/fetchAccounts',
  async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      console.log('Trước khi loginUser:', JSON.stringify(state));

      const user = state.accounts.find(account =>
        account.email === email && account.password === password
      );
      console.log('Người dùng tìm thấy:', JSON.stringify(user));

      if (user!=null) {
        if (user.lock === 'open') {
          state.accounts = state.accounts.map(account =>
            account.email === email ? { ...account, status: 1 } : { ...account, status: 0 }
          );
          state.currentUser = { ...user, status: 1 }; // Cập nhật trạng thái của currentUser
        } else {
          state.currentUser = null;
        }
      } else {
        state.currentUser = null;
      }
      console.log('Sau khi loginUser:', JSON.stringify(state));
    },
    logoutUser: (state) => {
      console.log('Trước khi logoutUser:', JSON.stringify(state));
      state.accounts = state.accounts.map(account => ({ ...account, status: 0 }));
      state.currentUser = null;
      console.log('Sau khi logoutUser:', JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
      console.log('Trước khi fetchAccounts.fulfilled:', JSON.stringify(state));
      state.accounts = action.payload;
      console.log('Sau khi fetchAccounts.fulfilled:', JSON.stringify(state));
    });
  },
});

export const { loginUser, logoutUser } = accountsSlice.actions;

export default accountsSlice.reducer;
