
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface GameType {
  _id: string;
  gameTypeName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface GameTypesState {
  types: GameType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameTypesState = {
  types: [],
  isLoading: false,
  error: null,
}

export const fetchGameTypes = createAsyncThunk('gameTypes/fetchGameTypes', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/games/types`, {
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

export const createGameType = createAsyncThunk('gameTypes/createGameType', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametypes/create`, { name }, {
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

export const updateGameType = createAsyncThunk('gameTypes/updateGameType', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametypes/${id}`, { name }, {
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

export const deleteGameType = createAsyncThunk('gameTypes/deleteGameType', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gametypes/${id}`, {
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


const gameTypesSlice = createSlice({
  name: 'gameTypes',
  initialState,
  reducers: {
    addGameType: (state, action: PayloadAction<GameType>) => {
      const exists = state.types.some(t => t._id === action.payload._id);
      if (!exists) {
        state.types.unshift(action.payload);
      }
    },
    updateGameTypeInList: (state, action: PayloadAction<GameType>) => {
      const index = state.types.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.types[index] = action.payload;
      }
    },
    removeGameTypeFromList: (state, action: PayloadAction<string>) => {
      state.types = state.types.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGameTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = action.payload;
      })
      .addCase(fetchGameTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createGameType.fulfilled, (state, action) => {
        state.types.push(action.payload);
        toast.success('Game Type created successfully!');
      })
      .addCase(createGameType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateGameType.fulfilled, (state, action) => {
        const index = state.types.findIndex(type => type._id === action.payload._id);
        if (index !== -1) {
          state.types[index] = action.payload;
        }
        toast.success('Game Type updated successfully!');
      })
      .addCase(updateGameType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteGameType.fulfilled, (state, action) => {
        state.types = state.types.filter(type => type._id !== action.payload);
        toast.success('Game Type deleted successfully!');
      })
      .addCase(deleteGameType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addGameType, updateGameTypeInList, removeGameTypeFromList } = gameTypesSlice.actions;
export default gameTypesSlice.reducer;




