import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '../../api/users';

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await usersApi.getUsers();
  return response.data;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id) => {
  const response = await usersApi.getUser(id);
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
  const response = await usersApi.createUser(userData);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => {
  const response = await usersApi.updateUser(id, data);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await usersApi.deleteUser(id);
  return id;
});

export const resetPassword = createAsyncThunk('users/resetPassword', async ({ id, password }) => {
  await usersApi.resetPassword(id, { password });
  return { id };
});

export const assignRole = createAsyncThunk('users/assignRole', async ({ userId, roleId }) => {
  await usersApi.assignRole({ user_id: userId, role_id: roleId });
  return { userId, roleId };
});

export const bindOperator = createAsyncThunk('users/bindOperator', async ({ supervisorId, operatorId }) => {
  await usersApi.bindOperator(supervisorId, { operator_id: operatorId });
  return { supervisorId, operatorId };
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    currentUser: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch single user
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      });
  },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;

