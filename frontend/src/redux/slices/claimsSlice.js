import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as claimsApi from '../../api/claims';

// Async thunks
export const fetchClaims = createAsyncThunk('claims/fetchClaims', async () => {
  const response = await claimsApi.getClaims();
  return response.data;
});

export const fetchClaim = createAsyncThunk('claims/fetchClaim', async (id) => {
  const response = await claimsApi.getClaim(id);
  return response.data;
});

export const createClaim = createAsyncThunk('claims/createClaim', async (claimData) => {
  const response = await claimsApi.createClaim(claimData);
  return response.data;
});

export const updateClaim = createAsyncThunk('claims/updateClaim', async ({ id, data }) => {
  const response = await claimsApi.updateClaim(id, data);
  return response.data;
});

export const uploadClaimFile = createAsyncThunk('claims/uploadFile', async ({ id, file }) => {
  const response = await claimsApi.uploadClaimFile(id, file);
  return { claimId: id, file: response.data };
});

export const addClaimComment = createAsyncThunk('claims/addComment', async ({ id, comment }) => {
  const response = await claimsApi.addClaimComment(id, { comment });
  return response.data;
});

const claimsSlice = createSlice({
  name: 'claims',
  initialState: {
    items: [],
    currentClaim: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentClaim: (state) => {
      state.currentClaim = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all claims
      .addCase(fetchClaims.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch single claim
      .addCase(fetchClaim.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClaim.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentClaim = action.payload;
      })
      .addCase(fetchClaim.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create claim
      .addCase(createClaim.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createClaim.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createClaim.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update claim
      .addCase(updateClaim.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateClaim.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((claim) => claim.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentClaim?.id === action.payload.id) {
          state.currentClaim = action.payload;
        }
      })
      .addCase(updateClaim.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Upload file
      .addCase(uploadClaimFile.fulfilled, (state, action) => {
        if (state.currentClaim && state.currentClaim.id === action.payload.claimId) {
          if (!state.currentClaim.files) {
            state.currentClaim.files = [];
          }
          state.currentClaim.files.push(action.payload.file);
        }
      })
      // Add comment
      .addCase(addClaimComment.fulfilled, (state, action) => {
        if (state.currentClaim) {
          if (!state.currentClaim.comments) {
            state.currentClaim.comments = [];
          }
          state.currentClaim.comments.push(action.payload);
        }
      });
  },
});

export const { clearCurrentClaim, clearError } = claimsSlice.actions;
export default claimsSlice.reducer;

