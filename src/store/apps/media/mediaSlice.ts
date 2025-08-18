import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosProgressEvent } from "axios";

import { toast } from "react-toastify";

export interface Media {
  _id: string;
  name: string;
  url: string;
  type: "image" | "video" | "pdf";
  category: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  lastUpdated?: string;
   usedIn?:[];
}

interface MediaState {
  media: Media[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number | null;
}

const initialState: MediaState = {
  media: [],
  isLoading: false,
  error: null,
  uploadProgress: null,
};



export const fetchMedia = createAsyncThunk(
  "media/fetchMedia",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mediaData = response.data.data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt,
        lastUpdated: item.lastUpdated,
      }));
      return mediaData;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const uploadMedia = createAsyncThunk(
  "media/uploadMedia",
  async (
    { files, category, usedIn }: { files: File[]; category: string; usedIn?: string[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("category", category);
      if (usedIn && usedIn.length > 0) {
        formData.append("usedIn", JSON.stringify(usedIn));
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              dispatch(setUploadProgress(percentCompleted));
            }
          },
        }
      );

      return response.data.data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt,
        lastUpdated: item.lastUpdated,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteMedia = createAsyncThunk(
  "media/deleteMedia",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateManyMediaByIds = createAsyncThunk(
  "media/updateManyMediaByIds",
  async ({ ids, category }: { ids: string[]; category: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/updatemany`,
        { ids, category },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateBulkMedia = createAsyncThunk(
  "media/updateBulkMedia",
  async ({ ids, usedIn }: { ids: string[]; usedIn: string[] }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/updateBulk`,
        { ids, usedIn },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteManyMediaByIds = createAsyncThunk(
  "media/deleteManyMediaByIds",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Authentication error: No token found.");

      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/deletemany`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });

      return ids;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);


export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number | null>) => {
      state.uploadProgress = action.payload;
    },
    addMedia: (state, action: PayloadAction<Media[]>) => {
      const newMedia = action.payload.filter(
        newItem => !state.media.some(existingItem => existingItem._id === newItem._id)
      );
      state.media.unshift(...newMedia);
    },
    updateMediaInList: (state, action: PayloadAction<Media[]>) => {
      action.payload.forEach(updatedItem => {
        const index = state.media.findIndex(item => item._id === updatedItem._id);
        if (index !== -1) {
          state.media[index] = updatedItem;
        }
      });
    },
    removeMediaFromList: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = new Set(action.payload);
      state.media = state.media.filter(item => !idsToRemove.has(item._id));
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMedia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(uploadMedia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = state.media.concat(action.payload);
        state.uploadProgress = null;
        toast.success("Media uploaded successfully!");
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.uploadProgress = null;
        toast.error(action.payload as string);
      })

      .addCase(deleteMedia.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = state.media.filter((item) => item._id !== action.payload);
        toast.success("Media deleted successfully!");
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(updateManyMediaByIds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateManyMediaByIds.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          action.payload.forEach((updatedMedia:Media) => {
            const index = state.media.findIndex(
              (media) => media._id === updatedMedia._id
            );
            if (index !== -1) {
              state.media[index] = updatedMedia;
            }
          });
        }
        toast.success("Media updated successfully!");
      })
      .addCase(updateManyMediaByIds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(updateBulkMedia.pending, (state) => {
        state.isLoading = false;
      })
      
      .addCase(updateBulkMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          action.payload.forEach((updatedMedia: Media) => {
            const index = state.media.findIndex(
              (media) => media._id === updatedMedia._id
            );
            if (index !== -1) {
              state.media[index] = updatedMedia;
            } 
          });
        }
        toast.success("Selected Media updated successfully!");
      })
      .addCase(updateBulkMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })


      .addCase(deleteManyMediaByIds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteManyMediaByIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = state.media.filter(
          (item) => !action.payload.includes(item._id)
        );
        toast.success("Selected media deleted successfully!");
      })
      .addCase(deleteManyMediaByIds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setUploadProgress, addMedia, updateMediaInList, removeMediaFromList } = mediaSlice.actions;
export default mediaSlice.reducer;



