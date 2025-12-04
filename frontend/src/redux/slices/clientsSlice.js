import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientsApi from '../../api/clients';

// Fetch all clients
export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  const response = await clientsApi.getClients();
  return response.data;
});

// Fetch single client profile (includes products + comments)
export const fetchClient = createAsyncThunk('clients/fetchClient', async (id) => {
  const response = await clientsApi.getClient(id);
  return response.data;
});

// Fetch client profile by user_id
export const fetchClientByUserId = createAsyncThunk('clients/fetchClientByUserId', async (userId, { dispatch }) => {
  const allClientsResponse = await clientsApi.getClients();
  const client = allClientsResponse.data.find(c => c.user_id === userId);
  if (client) {
    const clientDetailsResponse = await clientsApi.getClient(client.id);
    return clientDetailsResponse.data;
  }
  throw new Error('Client profile not found for the current user.');
});

// Fetch ONLY client products --------------------------
export const fetchClientProducts = createAsyncThunk('clients/fetchClientProducts', async (id) => {
  const response = await clientsApi.getClientProducts(id);
  return { clientId: id, products: response.data };
});

// Assign product ----------------------------------------
export const assignProductToClient = createAsyncThunk(
  'clients/assignProduct',
  async ({ id, productId }) => {
    const response = await clientsApi.assignProductToClient(id, {
      client_id: id,
      product_id: productId,
    });
    return response.data;
  }
);

// Add comment
export const addClientComment = createAsyncThunk('clients/addComment', async ({ id, comment }) => {
  const response = await clientsApi.addClientComment(id, { comment });
  return response.data;
});

// Fetch claims for a client
export const fetchClientClaims = createAsyncThunk('clients/fetchClaims', async (id) => {
  const response = await clientsApi.getClientClaims(id);
  return { clientId: id, claims: response.data };
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    currentClient: null,
    currentClientProducts: [],   // <-- NEW
    currentClientClaims: [],
    status: 'idle',
    error: null,
  },

  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
      state.currentClientProducts = [];
      state.currentClientClaims = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch single client profile
      .addCase(fetchClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentClient = action.payload;
        state.currentClientProducts = action.payload.products || [];
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch client by user_id
      .addCase(fetchClientByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentClient = action.payload;
        state.currentClientProducts = action.payload.products || [];
      })
      .addCase(fetchClientByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch only client products
      .addCase(fetchClientProducts.fulfilled, (state, action) => {
        state.currentClientProducts = action.payload.products;
      })

      // Assign product
      .addCase(assignProductToClient.fulfilled, (state, action) => {
        // Option A — push into dedicated products state (recommended)
        state.currentClientProducts.push(action.payload);

        // Option B — also sync into currentClient object
        if (state.currentClient) {
          if (!state.currentClient.products) {
            state.currentClient.products = [];
          }
          state.currentClient.products.push(action.payload);
        }
      })

      // Add comment
      .addCase(addClientComment.fulfilled, (state, action) => {
        if (state.currentClient) {
          if (!state.currentClient.comments) {
            state.currentClient.comments = [];
          }
          state.currentClient.comments.push(action.payload);
        }
      })

      // Fetch client claims
      .addCase(fetchClientClaims.fulfilled, (state, action) => {
        state.currentClientClaims = action.payload.claims;
      });
  },
});

export const { clearCurrentClient, clearError } = clientsSlice.actions;
export default clientsSlice.reducer;
