import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface Bonus {
  _id: string;
  name: string;
  slug: string;
  featuredImage: string;
  bonusType: { _id: string; name: string };
  status: 'enabled' | 'disabled';
  casino: { _id: string; name: string };
  minimumDeposit?: string;
  bonusCode?: string;
  wageringRequirements?: string;
  maximumBonusAmount?: string;
  maximumCashout?: string;
  bonusValue?: string;
  tags: { _id: string; name: string }[];
  url: string;
  allowedGames: { _id: string; name: string }[];
  additionalInformation?: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  featured: boolean;
  faq: { question: string; answer: string; _id?: string }[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the bonus state
interface BonusState {
  bonuses: Bonus[];
  bonus: Bonus | null;
  // Data for creating/editing bonuses
  bonusCreateData: {
    bonuseTypes: { _id: string; name: string }[];
    bonusTags: { _id: string; name: string }[];
    casinos: { _id: string; name: string }[];
    games: { _id: string; name: string }[];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: BonusState = {
  bonuses: [],
  bonus: null,
  bonusCreateData: {
    bonuseTypes: [],
    bonusTags: [],
    casinos: [],
    games: [],
  },
  isLoading: false,
  error: null,
};

export const fetchCasinoBonusCreateData = createAsyncThunk(
  'bonuses/fetchCasinoBonusCreateData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonusesdata`, {
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


export const createBonus = createAsyncThunk(
  'bonuses/createBonus',
  async (bonusData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }


      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/create`, bonusData, {
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

// Fetch all bonuses
export const fetchMyBonuses = createAsyncThunk(
  'bonuses/fetchMyBonuses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }


      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/mybonuses`, {
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

// Fetch a single bonus by ID
export const fetchBonusById = createAsyncThunk(
  'bonuses/fetchById',
  async (bonusId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/${bonusId}`, {
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

// Update a bonus
export const updateBonus = createAsyncThunk(
  'bonuses/updateBonus',
  async ({ id, bonusData }: { id: string; bonusData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/${id}`, bonusData, {
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

// Update bonus status
export const updateBonusStatus = createAsyncThunk(
  'bonuses/updateStatus',
  async ({ bonusId, newStatus }: { bonusId: string; newStatus: 'enabled' | 'disabled' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }


      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/${bonusId}`, { status: newStatus }, {
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

// Delete a bonus
export const deleteBonus = createAsyncThunk(
  'bonuses/deleteBonus',
  async (bonusId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bonuses/${bonusId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return bonusId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const bonusSlice = createSlice({
  name: 'bonuses',
  initialState,
  reducers: {
    clearBonus: (state) => {
      state.bonus = null;
    },
    addBonus: (state, action: PayloadAction<Bonus>) => {
      const exists = state.bonuses.some(b => b._id === action.payload._id);
      if (!exists) {
        state.bonuses.unshift(action.payload);
      }
    },
    updateBonusInList: (state, action: PayloadAction<Bonus>) => {
      const index = state.bonuses.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.bonuses[index] = action.payload;
      }
    },
    removeBonusFromList: (state, action: PayloadAction<string>) => {
      state.bonuses = state.bonuses.filter(b => b._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Casino bonuse Data
      .addCase(fetchCasinoBonusCreateData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCasinoBonusCreateData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonusCreateData = action.payload;
      })
      .addCase(fetchCasinoBonusCreateData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error('Failed to fetch bonus creation data');
      })

      // Create Bonus
      .addCase(createBonus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBonus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonuses.push(action.payload.data);
        toast.success('Bonus created successfully!');
      })
      .addCase(createBonus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Fetch Bonuses
      .addCase(fetchMyBonuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBonuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonuses = action.payload;
      })
      .addCase(fetchMyBonuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Fetch Bonus By ID
      .addCase(fetchBonusById.pending, (state) => {
        state.isLoading = true;
        state.bonus = null;
      })
      .addCase(fetchBonusById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonus = action.payload;
      })
      .addCase(fetchBonusById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Update Bonus
      .addCase(updateBonus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBonus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonus = action.payload.data;
        toast.success('Bonus updated successfully!');
      })
      .addCase(updateBonus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Update Bonus Status
      .addCase(updateBonusStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBonusStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bonuses.findIndex(
          (bonus) => bonus._id === action.payload._id
        );
        if (index !== -1) {
          state.bonuses[index] = action.payload;
        }
        toast.success('Bonus status updated successfully!');
      })
      .addCase(updateBonusStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Delete Bonus
      .addCase(deleteBonus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBonus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bonuses = state.bonuses.filter(
          (bonus) => bonus._id !== action.payload
        );
        toast.success('Bonus deleted successfully!');
      })
      .addCase(deleteBonus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearBonus, addBonus, updateBonusInList, removeBonusFromList } = bonusSlice.actions;
export default bonusSlice.reducer;