import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/auth';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authApi.login(credentials);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    roles: [],
    status: 'idle',
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },

    loadFromStorage: (state) => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      if (token && user) {
        const parsed = JSON.parse(user);
        state.token = token;
        state.user = parsed;
        state.roles = parsed.roles || [];
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.user = action.payload.user;
        state.token = action.payload.access_token;

        // ✅ FIXED: roles are inside user
        state.roles = action.payload.user.roles || [];

        // Persist properly
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })

      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
