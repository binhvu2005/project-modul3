import { createSlice } from '@reduxjs/toolkit';

export interface UserState { // Export this type
  isAuthenticated: boolean;
  name: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.name = action.payload.name;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.name = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
