import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosProgressEvent } from 'axios';
import { toast } from 'react-toastify';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role?: 'admin' | 'subadmin' | 'editor' | 'manager';
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  createdAt: string;
  updatedAt: string;
  username?: string;
  twoFactorEnabled?: boolean;
}

interface UserState {
  user: User | null; 
  viewedUser: User | null; 
  users: User[];
  isLoading: boolean;
  error: string | null;
  updateProgress: number | null;
}

const initialState: UserState = {
   user: null,
  viewedUser: null,
  users: [],
  isLoading: false,
  error: null,
  updateProgress: null,
};


export const createUser = createAsyncThunk<
  User,
  {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profileImage?: File | null;
    status?: string;
    role?: string;
    twoFactorEnabled?: boolean;
  },
  { rejectValue: string }
>(
  'user/createUser',
  async (
    {
      name,
      email,
      password,
      phone,
      profileImage,
      status,
      role,
      twoFactorEnabled,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication error: No token found.');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (phone) formData.append('phone', phone);
      if (profileImage) formData.append('profileImage', profileImage);
      if (status) formData.append('status', status);
      if (role) formData.append('role', role);
      if (twoFactorEnabled !== undefined)
        formData.append('twoFactorEnabled', twoFactorEnabled.toString());

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/create`,
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
  }
);

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('user/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return userId;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    return rejectWithValue(message);
  }
});


export const getUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>('user/getUserById', async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`,
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

export const updatebyid = createAsyncThunk<
  User,
  {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: File;
    status?: string;
    role?: string;
    twoFactorEnabled?: boolean;
  },
  { rejectValue: string }
>(
  'user/updatebyid',
  async (
    { id, name, email, phone, profileImage, status, role, twoFactorEnabled },
    { rejectWithValue, dispatch }
  ) => {
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
      if (status) formData.append('status', status);
      if (role) formData.append('role', role);
      if (twoFactorEnabled !== undefined)
        formData.append('twoFactorEnabled', twoFactorEnabled.toString());

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
  }
);

export const updatepasswordbyadmin = createAsyncThunk<
  User,
  { _id: string; password: string },
  { rejectValue: string }
>('user/updatepasswordbyadmin', async ({ _id, password }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Authentication error: No token found.');
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/update-password-by-admin`,
      { _id, password },
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


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUpdateProgress: (state, action: PayloadAction<number | null>) => {
      state.updateProgress = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.users = [];
      state.error = null;
      state.isLoading = false;
      state.updateProgress = null;
    },
    addUsers: (state, action: PayloadAction<User[]>) => {
      const newUsers = action.payload.filter(
        newUser => !state.users.some(existingUser => existingUser._id === newUser._id)
      );
      state.users.unshift(...newUsers);
    },
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
     removeUserFromList: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u._id !== action.payload);
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to create user.');
      })

      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to fetch users.');
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
        toast.success('User deleted successfully!');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to delete user.');
      })
      
      
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to fetch user data.');
      })
      .addCase(updatebyid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatebyid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        toast.success('User updated successfully!');
      })
      .addCase(updatebyid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to update user.');
      })
      .addCase(updatepasswordbyadmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatepasswordbyadmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        toast.success('Password updated successfully by admin!');
      })
      .addCase(updatepasswordbyadmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
        toast.error(action.payload ?? 'Failed to update password by admin.');
      });
  },
});

export const { setUpdateProgress, clearUser, addUsers, updateUserInList, removeUserFromList } = userSlice.actions;
export default userSlice.reducer;