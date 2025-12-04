import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as rolesApi from '../../api/roles';

// Async thunks
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  try {
    const response = await rolesApi.getRoles();
    return response.data || [];
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    return [];
  }
});

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        // Set empty array on error (endpoint might not exist)
        state.items = [];
      });
  },
});

export const { clearError } = rolesSlice.actions;
export default rolesSlice.reducer;

