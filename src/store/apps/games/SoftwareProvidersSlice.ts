
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


interface SoftwareProvider {
  _id: string;
  providerName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface SoftwareProvidersState {
  providers: SoftwareProvider[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SoftwareProvidersState = {
  providers: [],
  isLoading: false,
  error: null,
};


export const fetchSoftwareProviders = createAsyncThunk('softwareProviders/fetchSoftwareProviders', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/games/providers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const createSoftwareProvider = createAsyncThunk('softwareProviders/createSoftwareProvider', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/softwareproviders/create`, { name }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const updateSoftwareProvider = createAsyncThunk('softwareProviders/updateSoftwareProvider', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/softwareproviders/${id}`, { name }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const deleteSoftwareProvider = createAsyncThunk('softwareProviders/deleteSoftwareProvider', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/softwareproviders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return id;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});


const softwareProvidersSlice = createSlice({
  name: 'softwareProviders',
 initialState,
  reducers: {
    addSoftwareProvider: (state, action: PayloadAction<SoftwareProvider>) => {
      const exists = state.providers.some(p => p._id === action.payload._id);
      if (!exists) {
        state.providers.unshift(action.payload);
      }
    },
    updateSoftwareProviderInList: (state, action: PayloadAction<SoftwareProvider>) => {
      const index = state.providers.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
    },
    removeSoftwareProviderFromList: (state, action: PayloadAction<string>) => {
      state.providers = state.providers.filter(p => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoftwareProviders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSoftwareProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload;
      })
      .addCase(fetchSoftwareProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createSoftwareProvider.fulfilled, (state, action) => {
        state.providers.push(action.payload);
        toast.success('Software Provider created successfully!');
      })
      .addCase(createSoftwareProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateSoftwareProvider.fulfilled, (state, action) => {
        const index = state.providers.findIndex(provider => provider._id === action.payload._id);
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
        toast.success('Software Provider updated successfully!');
      })
      .addCase(updateSoftwareProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteSoftwareProvider.fulfilled, (state, action) => {
        state.providers = state.providers.filter(provider => provider._id !== action.payload);
        toast.success('Software Provider deleted successfully!');
      })
      .addCase(deleteSoftwareProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addSoftwareProvider, updateSoftwareProviderInList, removeSoftwareProviderFromList } = softwareProvidersSlice.actions;
export default softwareProvidersSlice.reducer;
