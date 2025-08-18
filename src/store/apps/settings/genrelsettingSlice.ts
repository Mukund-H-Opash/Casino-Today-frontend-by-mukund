import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosProgressEvent } from 'axios';
import { User } from '../users/userSlice';
import { toast } from 'react-toastify';

interface GenrelSettingState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateProgress: number | null;
}

const initialState: GenrelSettingState = {
  user: null,
  isLoading: false,
  error: null,
  updateProgress: null,
};

export const getMe = createAsyncThunk<
  User,
  void,
  { rejectValue: string }>(
  'genrelsetting/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch current user';
      return rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk<
  User,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>('genrelsetting/updatePassword', async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/update-password`,
      { currentPassword, newPassword },
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

export const updateProfile = createAsyncThunk<
  User,
  { id: string; name?: string; email?: string; phone?: string; profileImage?: File },
  { rejectValue: string }
>('genrelsetting/updateProfile', async ({ id, name, email, phone, profileImage }, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (email) formData.append('email', email);
    if (phone) formData.append('phone', phone);
    if (profileImage) formData.append('profileImage', profileImage);

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUpdateProgress(percentCompleted));
          }
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

const genrelsettingSlice = createSlice({
  name: 'genrelsetting',
  initialState,
  reducers: {
    setUpdateProgress: (state, action: PayloadAction<number | null>) => {
      state.updateProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to fetch user data.');
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        toast.success('Password updated successfully!');
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to update password.');
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.updateProgress = null;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        state.updateProgress = null;
        toast.error(action.payload ?? 'Failed to update profile.');
      });
  },
});

export const { setUpdateProgress } = genrelsettingSlice.actions;
export default genrelsettingSlice.reducer;