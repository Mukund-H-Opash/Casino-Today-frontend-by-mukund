
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface CasinoTag {
  _id: string;
  tagName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface CasinoTagsState {
  tags: CasinoTag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CasinoTagsState = {
  tags: [],
  isLoading: false,
  error: null,
};

export const fetchCasinoTags = createAsyncThunk('casinoTags/fetchCasinoTags', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/casinos/tags`, {
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

export const createCasinoTag = createAsyncThunk('casinoTags/createCasinoTag', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags/create`, { name }, {
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

export const updateCasinoTag = createAsyncThunk('casinoTags/updateCasinoTag', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags/${id}`, { name }, {
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

export const deleteCasinoTag = createAsyncThunk('casinoTags/deleteCasinoTag', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags/${id}`, {
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





const casinoTagsSlice = createSlice({
  name: 'casinoTags',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<CasinoTag>) => {
      const exists = state.tags.some(tag => tag._id === action.payload._id);
      if (!exists) {
        state.tags.unshift(action.payload);
      }
    },
    updateTagInList: (state, action: PayloadAction<CasinoTag>) => {
      const index = state.tags.findIndex(tag => tag._id === action.payload._id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
    removeTagFromList: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasinoTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCasinoTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchCasinoTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'An unknown error occurred';
      })
      .addCase(createCasinoTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
        toast.success('Tag created successfully!');
      })
      .addCase(createCasinoTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCasinoTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(tag => tag._id === action.payload._id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        toast.success('Tag updated successfully!');
      })
      .addCase(updateCasinoTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteCasinoTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(tag => tag._id !== action.payload);
        toast.success('Tag deleted successfully!');
      })
      .addCase(deleteCasinoTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addTag, updateTagInList, removeTagFromList } = casinoTagsSlice.actions;

export default casinoTagsSlice.reducer;




