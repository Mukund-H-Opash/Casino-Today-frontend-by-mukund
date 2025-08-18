
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface BonusType {
  _id: string;
  bonusTypeName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface BonusTypesState {
  types: BonusType[];
  isLoading: boolean;
  error: string | null;
}
const initialState: BonusTypesState = {
  types: [],
  isLoading: false,
  error: null,
};


export const fetchBonusTypes = createAsyncThunk('bonusTypes/fetchBonusTypes', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/bonuses/types`, {
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

export const createBonusType = createAsyncThunk('bonusTypes/createBonusType', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustypes/create`, { name }, {
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

export const updateBonusType = createAsyncThunk('bonusTypes/updateBonusType', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustypes/${id}`, { name }, {
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

export const deleteBonusType = createAsyncThunk('bonusTypes/deleteBonusType', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustypes/${id}`, {
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



const bonusTypesSlice = createSlice({
  name: 'bonusTypes',
  initialState,

  reducers: {
    addBonusType: (state, action: PayloadAction<BonusType>) => {
      const exists = state.types.some(t => t._id === action.payload._id);
      if (!exists) {
        state.types.unshift(action.payload);
      }
    },
    updateBonusTypeInList: (state, action: PayloadAction<BonusType>) => {
      const index = state.types.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.types[index] = action.payload;
      }
    },
    removeBonusTypeFromList: (state, action: PayloadAction<string>) => {
      state.types = state.types.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonusTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBonusTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = action.payload;
      })
      .addCase(fetchBonusTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createBonusType.fulfilled, (state, action) => {
        state.types.push(action.payload);
        toast.success('Bonus Type created successfully!');
      })
      .addCase(createBonusType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateBonusType.fulfilled, (state, action) => {
        const index = state.types.findIndex(type => type._id === action.payload._id);
        if (index !== -1) {
          state.types[index] = action.payload;
        }
        toast.success('Bonus Type updated successfully!');
      })
      .addCase(updateBonusType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteBonusType.fulfilled, (state, action) => {
        state.types = state.types.filter(type => type._id !== action.payload);
        toast.success('Bonus Type deleted successfully!');
      })
      .addCase(deleteBonusType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addBonusType, updateBonusTypeInList, removeBonusTypeFromList } = bonusTypesSlice.actions;
export default bonusTypesSlice.reducer;
