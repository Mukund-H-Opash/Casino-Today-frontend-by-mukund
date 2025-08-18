
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CasinoCountry {
  _id: string;
  countryName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface CasinoCountriesState {
  countries: CasinoCountry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CasinoCountriesState = {
  countries: [],
  isLoading: false,
  error: null,
};


export const fetchCasinoCountries = createAsyncThunk('casinoCountries/fetchCasinoCountries', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/casinos/countries`, {
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

export const createCasinoCountry = createAsyncThunk('casinoCountries/createCasinoCountry', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/create`, { name }, {
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

export const updateCasinoCountry = createAsyncThunk('casinoCountries/updateCasinoCountry', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${id}`, { name }, {
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

export const deleteCasinoCountry = createAsyncThunk('casinoCountries/deleteCasinoCountry', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries/${id}`, {
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




const casinoCountriesSlice = createSlice({
  name: 'casinoCountries',
  initialState,
  reducers: {
    addCountry: (state, action: PayloadAction<CasinoCountry>) => {
      const exists = state.countries.some(c => c._id === action.payload._id);
      if (!exists) {
        state.countries.unshift(action.payload);
      }
    },
    updateCountryInList: (state, action: PayloadAction<CasinoCountry>) => {
      const index = state.countries.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.countries[index] = action.payload;
      }
    },
    removeCountryFromList: (state, action: PayloadAction<string>) => {
      state.countries = state.countries.filter(c => c._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasinoCountries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCasinoCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCasinoCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createCasinoCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload);
        toast.success('Country created successfully!');
      })
      .addCase(createCasinoCountry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCasinoCountry.fulfilled, (state, action) => {
        const index = state.countries.findIndex(country => country._id === action.payload._id);
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
        toast.success('Country updated successfully!');
      })
      .addCase(updateCasinoCountry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteCasinoCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter(country => country._id !== action.payload);
        toast.success('Country deleted successfully!');
      })
      .addCase(deleteCasinoCountry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { addCountry, updateCountryInList, removeCountryFromList } = casinoCountriesSlice.actions;
export default casinoCountriesSlice.reducer;
