import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface CasinoReview {
  _id: string;
  name: string;
  slug: string;
  casinoUrl: string;
  rating: number | string;
  pros: string[];
  cons: string[];
  languages: string[];
  dateEstablished: number | string;
  licences: string[];
  casinoType: string[];
  affiliateProgram: string;
  company: string;
  restrictedCountries: string[];
  depositMethods: string[];
  withdrawalMethods: string[];
  withdrawalTimes: string[];
  withdrawalLimits: string[];
  softwareProviders: string[];
  gameTypes: string[];
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  tags: { _id: string; name: string }[];
  isFeatured: boolean;
  faq: { question: string; answer: string }[];
  customerSupport: {
    liveChat: boolean;
    phone: string;
    email: string;
  };
  responsibleGambling: {
    depositLimit: boolean;
    selfExclusion: boolean;
    withdrawal: boolean;
  };
  featuredLogo?: string;
  screenshots?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  isEnabled: boolean;
  lastUpdated: string;
  reviewer: {
    _id: string;
    name: string;
    email: string;
  }[];
}

interface ReviewData {
  languages: { _id: string; name: string }[];
  licences: { _id: string; name: string }[];
  countries: { _id: string; name: string }[];
  paymentMethods: { _id: string; methods: string }[];
  softwareProviders: { _id: string; name: string }[];
  gameTypes: { _id: string; name: string }[];
  casinoTags: { _id: string; name: string }[];
  reviewers: { _id: string; name: string }[];
}

interface CasinoState {
  casinos: CasinoReview[];
  casino: CasinoReview | null;
  reviewData: ReviewData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CasinoState = {
  casinos: [],
  casino: null,
  reviewData: null,
  isLoading: false,
  error: null,
};

export const fetchCasinoReviewData = createAsyncThunk(
  'casinos/fetchCasinoReviewData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/CasinoReview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);



export const createCasino = createAsyncThunk(
  'casinos/createCasino',
  async (casinoData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/create`, casinoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchMyCasinos = createAsyncThunk(
  'casinos/fetchMyCasinos',
  async (_, { rejectWithValue }) => {
    try {
       const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/mycasinos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data; 
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchCasinoById = createAsyncThunk(
  'casinos/fetchById',
  async (casinoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/${casinoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Normalize tags to ensure only _id and name are included
      const casinoData = response.data.data;
      casinoData.tags = casinoData.tags.map((tag: any) => ({
        _id: tag._id,
        name: tag.name
      }));

      return casinoData;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);
export const updateCasino = createAsyncThunk(
  'casinos/updateCasino',
  async ({ id, casinoData }: { id: string; casinoData: FormData | Partial<CasinoReview> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

      const isFormData = casinoData instanceof FormData;

      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/${id}`, casinoData, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateCasinoStatus = createAsyncThunk(
  'casinos/updateStatus',
 async ({ casinoId, newStatus }: { casinoId: string; newStatus: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/${casinoId}`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.data; // Return the full updated casino object
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteCasino = createAsyncThunk(
  'casinos/deleteCasino',
  async (casinoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Authentication error: No token found.");
      }

  
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/casinos/${casinoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return casinoId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const casinoSlice = createSlice({
  name: 'casinos',
  initialState,
  reducers: {
    clearCasino: (state) => {
      state.casino = null;
    },
    addCasino: (state, action) => {
      const exists = state.casinos.some(c => c._id === action.payload._id);
      if (!exists) {
        state.casinos.unshift(action.payload);
      }
    },
    updateCasinoInList: (state, action) => {
      const index = state.casinos.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.casinos[index] = action.payload;
      }
    },
    removeCasinoFromList: (state, action) => {
      state.casinos = state.casinos.filter(c => c._id !== action.payload);
    }
  },

  extraReducers: (builder) => {
    builder

      // Fetch Casino Review Data
      .addCase(fetchCasinoReviewData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCasinoReviewData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewData = action.payload;
      })
      .addCase(fetchCasinoReviewData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string); 
      })

      // Create Casino
      .addCase(createCasino.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCasino.fulfilled, (state, action) => {
        state.isLoading = false;
        state.casinos.push(action.payload.data);
        toast.success('Casino created successfully!');
      })
      .addCase(createCasino.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Fetch Casinos
      .addCase(fetchMyCasinos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCasinos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.casinos = action.payload; 
      })
      .addCase(fetchMyCasinos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Fetch Casino By ID
      .addCase(fetchCasinoById.pending, (state) => {
        state.isLoading = true;
        state.casino = null; 
      })
      .addCase(fetchCasinoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.casino = action.payload;
      })
      .addCase(fetchCasinoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Update Casino
      .addCase(updateCasino.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCasino.fulfilled, (state, action) => {
        state.isLoading = false;
        state.casino = action.payload.data; 
        toast.success('Casino updated successfully!');
      })
      .addCase(updateCasino.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Update Casino Status
      .addCase(updateCasinoStatus.pending, (state) => {
      })
      .addCase(updateCasinoStatus.fulfilled, (state, action) => {
        const index = state.casinos.findIndex(
          (casino) => casino._id === action.payload._id
        );
        if (index !== -1) {
          state.casinos[index] = action.payload;
        }
        toast.success('Casino Status updated successfully!');
      })
      .addCase(updateCasinoStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      

      // Delete Casino
      .addCase(deleteCasino.pending, (state) => {
        state.isLoading = true;
      })
       .addCase(deleteCasino.fulfilled, (state, action) => {
        state.isLoading = false;
        state.casinos = state.casinos.filter(
          (casino) => casino._id !== action.payload
        );
        toast.success('Casino deleted successfully!');
      })
      .addCase(deleteCasino.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { clearCasino, addCasino, updateCasinoInList, removeCasinoFromList } = casinoSlice.actions;
export default casinoSlice.reducer;