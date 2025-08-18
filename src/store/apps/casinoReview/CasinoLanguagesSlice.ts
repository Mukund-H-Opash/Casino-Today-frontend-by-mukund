
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CasinoLanguage {
  _id: string;
  languageName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface CasinoLanguagesState {
  languages: CasinoLanguage[];
  isLoading: boolean;
  error: string | null;
}
const initialState: CasinoLanguagesState = {
  languages: [],
  isLoading: false,
  error: null,
};

export const fetchCasinoLanguages = createAsyncThunk('casinoLanguages/fetchCasinoLanguages', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/casinos/languages`, {
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

export const createCasinoLanguage = createAsyncThunk('casinoLanguages/createCasinoLanguage', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/languages/create`, { name }, {
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

export const updateCasinoLanguage = createAsyncThunk('casinoLanguages/updateCasinoLanguage', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/languages/${id}`, { name }, {
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

export const deleteCasinoLanguage = createAsyncThunk('casinoLanguages/deleteCasinoLanguage', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/languages/${id}`, {
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





const casinoLanguagesSlice = createSlice({
  name: 'casinoLanguages',
  initialState,
  reducers: {
    addLanguage: (state, action: PayloadAction<CasinoLanguage>) => {
      const exists = state.languages.some(lang => lang._id === action.payload._id);
      if (!exists) {
        state.languages.unshift(action.payload);
      }
    },
    updateLanguageInList: (state, action: PayloadAction<CasinoLanguage>) => {
      const index = state.languages.findIndex(lang => lang._id === action.payload._id);
      if (index !== -1) {
        state.languages[index] = action.payload;
      }
    },
    removeLanguageFromList: (state, action: PayloadAction<string>) => {
      state.languages = state.languages.filter(lang => lang._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasinoLanguages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCasinoLanguages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.languages = action.payload;
      })
      .addCase(fetchCasinoLanguages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createCasinoLanguage.fulfilled, (state, action) => {
        state.languages.push(action.payload);
        toast.success('Language created successfully!');
      })
      .addCase(createCasinoLanguage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCasinoLanguage.fulfilled, (state, action) => {
        const index = state.languages.findIndex(language => language._id === action.payload._id);
        if (index !== -1) {
          state.languages[index] = action.payload;
        }
        toast.success('Language updated successfully!');
      })
      .addCase(updateCasinoLanguage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteCasinoLanguage.fulfilled, (state, action) => {
        state.languages = state.languages.filter(language => language._id !== action.payload);
        toast.success('Language deleted successfully!');
      })
      .addCase(deleteCasinoLanguage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addLanguage, updateLanguageInList, removeLanguageFromList } = casinoLanguagesSlice.actions;

export default casinoLanguagesSlice.reducer;
