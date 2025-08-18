import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

// Define the shape of a single game
export interface Game {
  _id: string;
  name: string;
  slug: string;
  softwareProvider?: { _id: string; name: string };
  gameType?: { _id: string; name: string };
  paylines: number;
  reels: number;
  minCoinsPerLine: number;
  maxCoinsPerLine: number;
  minCoinsSize: number;
  maxCoinsSize: number;
  rtp: number;
  bonusGame: boolean;
  progressive: boolean;
  wildSymbol: boolean;
  scatterSymbol: boolean;
  autoplayOption: boolean;
  multiplier: boolean;
  freeSpins: boolean;
  seoTitle: string;
  metaDescription: string;
  featuredLogo: string;
  screenshots?: string[];
  excerpt: string;
  body: string;
  tags: { _id: string; name: string }[];
  featured: boolean;
  faq: { question: string; answer: string; _id?: string }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the game state
interface GameState {
  games: Game[];
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  game: null,
  isLoading: false,
  error: null,
};

// Create an async thunk for fetching game creation data
export const fetchGameCreateData = createAsyncThunk(
  'games/fetchGameCreateData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gamesdata`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Create an async thunk for creating a game
export const createGame = createAsyncThunk(
  'games/createGame',
  async (gameData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/create`, gameData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Fetch all games
export const fetchMyGames = createAsyncThunk(
  'games/fetchMyGames',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/mygames`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Fetch a single game by ID
export const fetchGameById = createAsyncThunk(
  'games/fetchById',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Update a game
export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ id, gameData }: { id: string; gameData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${id}`, gameData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Update game status
export const updateGameStatus = createAsyncThunk(
  'games/updateStatus',
  async ({ gameId, newStatus }: { gameId: string; newStatus: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${gameId}`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Delete a game
export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return gameId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearGame: (state) => {
      state.game = null;
    },
    addGame: (state, action: PayloadAction<Game>) => {
      const exists = state.games.some(g => g._id === action.payload._id);
      if (!exists) {
        state.games.unshift(action.payload);
      }
    },
    updateGameInList: (state, action: PayloadAction<Game>) => {
      const index = state.games.findIndex(g => g._id === action.payload._id);
      if (index !== -1) {
        state.games[index] = action.payload;
      }
    },
    removeGameFromList: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter(g => g._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Game Create Data
      .addCase(fetchGameCreateData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameCreateData.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchGameCreateData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Create Game
      .addCase(createGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games.push(action.payload.data);
        toast.success('Game created successfully!');
      })
      .addCase(createGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Fetch Games
      .addCase(fetchMyGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
      })
      .addCase(fetchMyGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Fetch Game By ID
      .addCase(fetchGameById.pending, (state) => {
        state.isLoading = true;
        state.game = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.game = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Update Game
      .addCase(updateGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.game = action.payload.data;
        toast.success('Game updated successfully!');
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Update Game Status
      .addCase(updateGameStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGameStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.games.findIndex(
          (game) => game._id === action.payload._id
        );
        if (index !== -1) {
          state.games[index] = action.payload;
        }
        toast.success('Game status updated successfully!');
      })
      .addCase(updateGameStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Delete Game
      .addCase(deleteGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = state.games.filter(
          (game) => game._id !== action.payload
        );
        toast.success('Game deleted successfully!');
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearGame, addGame, updateGameInList, removeGameFromList } = gameSlice.actions;
export default gameSlice.reducer;