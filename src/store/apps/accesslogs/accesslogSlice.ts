import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import socket from '@/utils/socket';

// Define the AccessLog interface based on observed usage
export interface AccessLog {
  _id: string;
  user?: {
    name: string;
  };
  action: string;
  details?: string;
  createdAt: string;
}

interface AccessLogState {
  accessLogs: AccessLog[]; // Use the AccessLog interface here
  userAccessLogs: AccessLog[]; // Use the AccessLog interface here
  loading: boolean;
  error: string | null;
  accessLog: AccessLog | null; // Use the AccessLog interface here
}

const initialState: AccessLogState = {
  accessLogs: [],
  userAccessLogs: [],
  loading: false,
  error: null,
  accessLog: null,
};

export const getAccessLogs = createAsyncThunk('accessLogs/getAccessLogs', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activitylogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const getAccessLogById = createAsyncThunk(
  'accessLogs/getAccessLogById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activitylogs/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

const accessLogSlice = createSlice({
  name: 'accessLogs',
  initialState,
  reducers: {
    addAccessLog: (state, action: { payload: AccessLog }) => {
      // Check for duplicates to be safe
      const exists = state.accessLogs.some(log => log._id === action.payload._id);

      if (!exists) {
        // Add the new log to the top of the list
        state.accessLogs.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccessLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.accessLogs = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(getAccessLogs.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string);
      })
      .addCase(getAccessLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.userAccessLogs = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(getAccessLogById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string);
      });
  },
});

export const { addAccessLog } = accessLogSlice.actions;

export default accessLogSlice.reducer;



