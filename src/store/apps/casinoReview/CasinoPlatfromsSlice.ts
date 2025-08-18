import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

// Define the CasinoPlatform type
export interface CasinoPlatform {
  _id: string;
  name: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

interface CasinoPlatformsState {
  platforms: CasinoPlatform[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CasinoPlatformsState = {
  platforms: [],
  isLoading: false,
  error: null,
};

export const fetchCasinoPlatforms = createAsyncThunk(
  'casinoPlatforms/fetchCasinoPlatforms',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Platforms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const createCasinoPlatform = createAsyncThunk(
  'casinoPlatforms/createCasinoPlatform',
  async (name: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Platforms/create`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.data.message || error.message);
    }
  }
);

export const updateCasinoPlatform = createAsyncThunk(
  'casinoPlatforms/updateCasinoPlatform',
  async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Platforms/${id}`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.data.message || error.message);
    }
  }
);

export const deleteCasinoPlatform = createAsyncThunk(
  'casinoPlatforms/deleteCasinoPlatform',
  async (id: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Platforms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.data.message || error.message);
    }
  }
);

const casinoPlatformsSlice = createSlice({
  name: 'casinoPlatforms',
  initialState,
  reducers: {
    addPlatform: (state, action: PayloadAction<CasinoPlatform>) => {
      const exists = state.platforms.some(p => p._id === action.payload._id);
      if (!exists) {
        state.platforms.unshift(action.payload);
      }
    },
    updatePlatformInList: (state, action: PayloadAction<CasinoPlatform>) => {
      const index = state.platforms.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.platforms[index] = action.payload;
      }
    },
    removePlatformFromList: (state, action: PayloadAction<string>) => {
      state.platforms = state.platforms.filter(p => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasinoPlatforms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCasinoPlatforms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platforms = Array.isArray(action.payload.data) ? action.payload.data : [];
        toast.error('this data is not used anywhere');
      })
      .addCase(fetchCasinoPlatforms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createCasinoPlatform.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCasinoPlatform.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platforms = [...state.platforms, action.payload];
        toast.success('Platform created successfully');
      })
      .addCase(createCasinoPlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCasinoPlatform.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCasinoPlatform.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platforms = state.platforms.map(platform => platform._id === action.payload._id ? action.payload : platform);
        toast.success('Platform updated successfully');
      })
      .addCase(updateCasinoPlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteCasinoPlatform.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCasinoPlatform.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platforms = state.platforms.filter(platform => platform._id !== action.payload._id);
        toast.success('Platform deleted successfully');
      })
      .addCase(deleteCasinoPlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addPlatform, updatePlatformInList, removePlatformFromList } = casinoPlatformsSlice.actions;

export default casinoPlatformsSlice.reducer;


