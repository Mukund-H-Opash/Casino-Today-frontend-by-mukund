import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Interface for the User (from populated author field)
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  lastUpdated?: string;
}

// Interface for CustomPage
interface User {
  _id: string;
  name: string;
  email: string;
}

export interface CustomPage {
  _id: string;
  title: string;
  slug: string;
  status: 'enabled' | 'disabled';
  author: User;
  seoTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  body: string;
  createdAt: string;
  
  updatedAt: string;
}

interface CustomPageState {
  pages: CustomPage[];
  page: CustomPage | null;
  isLoading: boolean;
  error: string | null;
  rowsPerPage: number;
}

const initialState: CustomPageState = {
  pages: [],
  page: null,
  isLoading: false,
  error: null,
  rowsPerPage: 5,
};

// Async thunk for creating a custom page
export const fetchMyCustomPages = createAsyncThunk(
  'customPages/fetchMyCustomPages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.get( `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/mypages`,{
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

// Other thunks remain unchanged
export const createCustomPage = createAsyncThunk(
  'customPages/createCustomPage',
  async (pageData: FormData | Partial<CustomPage>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      
      const isFormData = pageData instanceof FormData;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/create `, pageData, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchCustomPageById = createAsyncThunk(
  'customPages/fetchById',
  async (pageId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/${pageId}`, {
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

export const updateCustomPage = createAsyncThunk(
  'customPages/updateCustomPage',
  async (
    { id, pageData }: { id: string; pageData: FormData | Partial<CustomPage> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }


      const isFormData = pageData instanceof FormData;

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/${id}`, pageData, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteCustomPage = createAsyncThunk(
  'customPages/deleteCustomPage',
  async (pageId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }


      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      return pageId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateCustompageStatus = createAsyncThunk(
  'customPages/updateCustompageStatus',
  async ({ pageId, newStatus }: { pageId: string; newStatus: 'enabled' | 'disabled' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custompages/${pageId}`, { status: newStatus }, {
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

export const customPageSlice = createSlice({
  name: 'customPages',
  initialState,
  reducers: {
    clearCustomPage: (state) => {
      state.page = null;
    },
    addCustomPage: (state, action: PayloadAction<CustomPage>) => {
      const exists = state.pages.some(p => p._id === action.payload._id);
      if (!exists) {
        state.pages.unshift(action.payload);
      }
    },
    updateCustomPageInList: (state, action: PayloadAction<CustomPage>) => {
      const index = state.pages.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.pages[index] = action.payload;
      }
    },
    removeCustomPageFromList: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(p => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCustomPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCustomPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = action.payload;
      })
      .addCase(fetchMyCustomPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(createCustomPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages.push(action.payload.data);
        toast.success('Custom page created successfully!');
      })
      .addCase(createCustomPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(fetchCustomPageById.pending, (state) => {
        state.isLoading = true;
        state.page = null;
      })
      .addCase(fetchCustomPageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.page = action.payload;
      })
      .addCase(fetchCustomPageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateCustomPage.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateCustomPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.page = action.payload.data;
        const index = state.pages.findIndex(
          (page) => page._id === action.payload.data._id
        );
        if (index !== -1) {
          state.pages[index] = action.payload.data;
        }
        toast.success('Custom page updated successfully!');
      })
      .addCase(updateCustomPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      .addCase(deleteCustomPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = state.pages.filter((page) => page._id !== action.payload);
        toast.success('Custom page deleted successfully!');
      })
      .addCase(deleteCustomPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Update Custom Page Status
      .addCase(updateCustompageStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustompageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.pages.findIndex(
          (page) => page._id === action.payload._id
        );
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
        toast.success('Custom page status updated successfully!');
      })
      .addCase(updateCustompageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { clearCustomPage, addCustomPage, updateCustomPageInList, removeCustomPageFromList } = customPageSlice.actions;
export default customPageSlice.reducer;