
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CasinoLicence {
  _id: string;
  licenceName: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface CasinoLicencesState {
  licences: CasinoLicence[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CasinoLicencesState = {
  licences: [],
  isLoading: false,
  error: null,
};

export const fetchCasinoLicences = createAsyncThunk('casinoLicences/fetchCasinoLicences', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/statistics/casinos/licences`, {
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

export const createCasinoLicence = createAsyncThunk('casinoLicences/createCasinoLicence', async (name: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/licences/create`, { name }, {
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

export const updateCasinoLicence = createAsyncThunk('casinoLicences/updateCasinoLicence', async ({ id, name }: { id: string, name: string }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/licences/${id}`, { name }, {
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

export const deleteCasinoLicence = createAsyncThunk('casinoLicences/deleteCasinoLicence', async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/licences/${id}`, {
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




const casinoLicencesSlice = createSlice({
  name: 'casinoLicences',
  initialState,
  reducers: {
    addLicence: (state, action: PayloadAction<CasinoLicence>) => {
      const exists = state.licences.some(l => l._id === action.payload._id);
      if (!exists) {
        state.licences.unshift(action.payload);
      }
    },
    updateLicenceInList: (state, action: PayloadAction<CasinoLicence>) => {
      const index = state.licences.findIndex(l => l._id === action.payload._id);
      if (index !== -1) {
        state.licences[index] = action.payload;
      }
    },
    removeLicenceFromList: (state, action: PayloadAction<string>) => {
      state.licences = state.licences.filter(l => l._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasinoLicences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCasinoLicences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licences = action.payload;
      })
      .addCase(fetchCasinoLicences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createCasinoLicence.fulfilled, (state, action) => {
        state.licences.push(action.payload);
        toast.success('Licence created successfully!');
      })
      .addCase(createCasinoLicence.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCasinoLicence.fulfilled, (state, action) => {
        const index = state.licences.findIndex(licence => licence._id === action.payload._id);
        if (index !== -1) {
          state.licences[index] = action.payload;
        }
        toast.success('Licence updated successfully!');
      })
      .addCase(updateCasinoLicence.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteCasinoLicence.fulfilled, (state, action) => {
        state.licences = state.licences.filter(licence => licence._id !== action.payload);
        toast.success('Licence deleted successfully!');
      })
      .addCase(deleteCasinoLicence.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});
export const { addLicence, updateLicenceInList, removeLicenceFromList } = casinoLicencesSlice.actions;
export default casinoLicencesSlice.reducer;
