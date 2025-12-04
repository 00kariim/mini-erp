import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as leadsApi from '../../api/leads';

// Async thunks
export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const response = await leadsApi.getLeads();
  return response.data;
});

export const fetchLead = createAsyncThunk('leads/fetchLead', async (id) => {
  const response = await leadsApi.getLead(id);
  return response.data;
});

export const createLead = createAsyncThunk('leads/createLead', async (leadData) => {
  const response = await leadsApi.createLead(leadData);
  return response.data;
});

export const updateLead = createAsyncThunk('leads/updateLead', async ({ id, data }) => {
  const response = await leadsApi.updateLead(id, data);
  return response.data;
});

export const deleteLead = createAsyncThunk('leads/deleteLead', async (id) => {
  await leadsApi.deleteLead(id);
  return id;
});

export const addLeadComment = createAsyncThunk('leads/addComment', async ({ id, comment }) => {
  const response = await leadsApi.addLeadComment(id, { comment });
  return response.data;
});

export const convertLeadToClient = createAsyncThunk('leads/convertToClient', async (id) => {
  const response = await leadsApi.convertLeadToClient(id);
  return { id, ...response.data };
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],
    currentLead: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leads
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch single lead
      .addCase(fetchLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentLead = action.payload;
      })
      .addCase(fetchLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create lead
      .addCase(createLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.items = state.items.filter((lead) => lead.id !== action.payload);
        if (state.currentLead?.id === action.payload) {
          state.currentLead = null;
        }
      })
      // Add comment
      .addCase(addLeadComment.fulfilled, (state, action) => {
        if (state.currentLead) {
          if (!state.currentLead.comments) {
            state.currentLead.comments = [];
          }
          state.currentLead.comments.push(action.payload);
        }
      })
      // Convert to client
      .addCase(convertLeadToClient.fulfilled, (state, action) => {
        const index = state.items.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = 'converted';
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead.status = 'converted';
        }
      });
  },
});

export const { clearCurrentLead, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;

