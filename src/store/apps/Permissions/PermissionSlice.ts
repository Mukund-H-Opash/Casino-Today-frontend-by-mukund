import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface PermissionState {
  [module: string]: { [permission: string]: boolean };
}

export interface PermissionsData {
  _id: string;
  user: string;
  permissions: PermissionState;
}

interface PermissionSliceState {
  permissions: PermissionsData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PermissionSliceState = {
  permissions: null,
  isLoading: false,
  error: null,
};

export const getPermissions = createAsyncThunk<
  PermissionsData,
  { id: string },
  { rejectValue: string }
>('permissions/getPermissions', async ({ id }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data; // Returns { _id, user, permissions }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const updatePermissions = createAsyncThunk<
  PermissionsData,
  { id: string; permissions: string[] },
  { rejectValue: string }
>('permissions/updatePermissions', async ({ id, permissions }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/${id}`,
      { permissions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissions: (state) => {
      state.permissions = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload;
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to fetch permissions.');
      })
      .addCase(updatePermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload;
        toast.success('Permissions updated successfully!');
      })
      .addCase(updatePermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to update permissions.');
      });
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;