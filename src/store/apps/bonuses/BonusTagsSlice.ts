
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface BonusTag {
  _id: string;
  bonusTagName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface BonusTagsState {
  tags: BonusTag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BonusTagsState = {
  tags: [],
  isLoading: false,
  error: null,
};


export const fetchBonusTags = createAsyncThunk('bonusTags/fetchBonusTags', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/bonuses/tags`, {
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

export const createBonusTag = createAsyncThunk('bonusTags/createBonusTag', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustags/create`, { name }, {
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

export const updateBonusTag = createAsyncThunk('bonusTags/updateBonusTag', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustags/${id}`, { name }, {
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

export const deleteBonusTag = createAsyncThunk('bonusTags/deleteBonusTag', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonustags/${id}`, {
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



const bonusTagsSlice = createSlice({
  name: 'bonusTags',
  initialState,
  reducers: {
    addBonusTag: (state, action: PayloadAction<BonusTag>) => {
      const exists = state.tags.some(t => t._id === action.payload._id);
      if (!exists) {
        state.tags.unshift(action.payload);
      }
    },
    updateBonusTagInList: (state, action: PayloadAction<BonusTag>) => {
      const index = state.tags.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
    removeBonusTagFromList: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonusTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBonusTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchBonusTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createBonusTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
        toast.success('Bonus Tag created successfully!');
      })
      .addCase(createBonusTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateBonusTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(tag => tag._id === action.payload._id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        toast.success('Bonus Tag updated successfully!');
      })
      .addCase(updateBonusTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteBonusTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(tag => tag._id !== action.payload);
        toast.success('Bonus Tag deleted successfully!');
      })
      .addCase(deleteBonusTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addBonusTag, updateBonusTagInList, removeBonusTagFromList } = bonusTagsSlice.actions;
export default bonusTagsSlice.reducer;


