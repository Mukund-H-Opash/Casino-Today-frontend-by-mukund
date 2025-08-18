
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchGameTags = createAsyncThunk('gameTags/fetchGameTags', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/games/tags`, {
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

export const createGameTag = createAsyncThunk('gameTags/createGameTag', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametags/create`, { name }, {
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

export const updateGameTag = createAsyncThunk('gameTags/updateGameTag', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametags/${id}`, { name }, {
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

export const deleteGameTag = createAsyncThunk('gameTags/deleteGameTag', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametags/${id}`, {
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

interface GameTag {
  _id: string;
  gameTagName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface GameTagsState {
  tags: GameTag[];
  isLoading: boolean;
  error: string | null;
}
const initialState: GameTagsState = {
  tags: [],
  isLoading: false,
  error: null,
};

const gameTagsSlice = createSlice({
  name: 'gameTags',
  initialState,

  reducers: {
    addGameTag: (state, action: PayloadAction<GameTag>) => {
      const exists = state.tags.some(t => t._id === action.payload._id);
      if (!exists) {
        state.tags.unshift(action.payload);
      }
    },
    updateGameTagInList: (state, action: PayloadAction<GameTag>) => {
      const index = state.tags.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
    removeGameTagFromList: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGameTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchGameTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createGameTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
        toast.success('Game Tag created successfully!');
      })
      .addCase(createGameTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateGameTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(tag => tag._id === action.payload._id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        toast.success('Game Tag updated successfully!');
      })
      .addCase(updateGameTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteGameTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(tag => tag._id !== action.payload);
        toast.success('Game Tag deleted successfully!');
      })
      .addCase(deleteGameTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addGameTag, updateGameTagInList, removeGameTagFromList } = gameTagsSlice.actions;
export default gameTagsSlice.reducer;


