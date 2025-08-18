import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

// Define the GameFeature type
export interface GameFeature {
  _id: string;
  gameFeatureName: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

interface GameFeaturesState {
  features: GameFeature[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameFeaturesState = {
  features: [],
  isLoading: false,
  error: null,
};

export const fetchGameFeatures = createAsyncThunk(
  'gameFeatures/fetchGameFeatures',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/GameFeatures`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data; // Assuming the API returns { data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const createGameFeature = createAsyncThunk(
  'gameFeatures/createGameFeature',
  async (name: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/GameFeatures/create`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response.data.message || error.message);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const updateGameFeature = createAsyncThunk(
  'gameFeatures/updateGameFeature',
  async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/GameFeatures/${id}`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response.data.message || error.message);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const deleteGameFeature = createAsyncThunk(
  'gameFeatures/deleteGameFeature',
  async (id: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/GameFeatures/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return id; // Return the ID of the deleted feature
    } catch (error: any) {
      toast.error(error.response.data.message || error.message);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const gameFeaturesSlice = createSlice({
  name: 'gameFeatures',
  initialState,
  reducers: {
    addGameFeature: (state, action: PayloadAction<GameFeature>) => {
      const exists = state.features.some(f => f._id === action.payload._id);
      if (!exists) {
        state.features.unshift(action.payload);
      }
    },
    updateGameFeatureInList: (state, action: PayloadAction<GameFeature>) => {
      const index = state.features.findIndex(f => f._id === action.payload._id);
      if (index !== -1) {
        state.features[index] = action.payload;
      }
    },
    removeGameFeatureFromList: (state, action: PayloadAction<string>) => {
      state.features = state.features.filter(f => f._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameFeatures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.features = action.payload;
         toast.error('this data is not used anywhere');   
      })
      .addCase(fetchGameFeatures.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(createGameFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGameFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.features.push(action.payload);
        toast.success('Game Feature created successfully');
      })
      .addCase(createGameFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(updateGameFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGameFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.features.findIndex(feature => feature._id === action.payload._id);
        if (index !== -1) {
          state.features[index] = action.payload;
          toast.success('Game Feature updated successfully');
        }
      })
      .addCase(updateGameFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(deleteGameFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGameFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.features = state.features.filter(feature => feature._id !== action.payload);
        toast.success('Game Feature deleted successfully');
      })
      .addCase(deleteGameFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });
  },
});
export const { addGameFeature, updateGameFeatureInList, removeGameFeatureFromList } = gameFeaturesSlice.actions;
export default gameFeaturesSlice.reducer;
