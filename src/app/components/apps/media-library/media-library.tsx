import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAppDispatch } from '@/store/store';
import { useSelector } from '@/store/hooks';
import { fetchMedia, uploadMedia, deleteMedia, updateManyMediaByIds, deleteManyMediaByIds, updateBulkMedia, Media } from '@/store/apps/media/mediaSlice';
import { toast } from 'react-toastify';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import BlankCard from '../../shared/BlankCard';
import socket from '@/utils/socket';
import { addMedia, updateMediaInList, removeMediaFromList } from '@/store/apps/media/mediaSlice';

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const MediaLibrary = () => {
  const dispatch = useAppDispatch();
  const { media, isLoading, error, uploadProgress } = useSelector((state: { media: any; }) => state.media);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('General');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [bulkUpdateCategory, setBulkUpdateCategory] = useState<string>('');
  const [bulkUpdateUsedIn, setBulkUpdateUsedIn] = useState<string[]>([]);
  
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);
useEffect(() => {
    const handleMediaCreated = (newMediaItems: Media[]) => {
      dispatch(addMedia(newMediaItems));
    };
    const handleMediaUpdated = (updatedMediaItems: Media[]) => {
      dispatch(updateMediaInList(updatedMediaItems));
    };
    const handleMediaDeleted = (mediaIds: string[]) => {
      dispatch(removeMediaFromList(mediaIds));
    };

    socket.on('mediaCreated', handleMediaCreated);
    socket.on('mediaUpdated', handleMediaUpdated);
    socket.on('mediaDeleted', handleMediaDeleted);

    return () => {
      socket.off('mediaCreated', handleMediaCreated);
      socket.off('mediaUpdated', handleMediaUpdated);
      socket.off('mediaDeleted', handleMediaDeleted);
    };
  }, [dispatch]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        await dispatch(uploadMedia({ files: acceptedFiles, category: selectedCategory, usedIn: bulkUpdateUsedIn })).unwrap();
        dispatch(fetchMedia());
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }, [dispatch, selectedCategory, bulkUpdateUsedIn]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': []
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteMedia(id)).unwrap();
      dispatch(fetchMedia());
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSelectMedia = (id: string) => {
    setSelectedMedia((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return Array.from(newSet);
    });
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) {
      toast.warn('Please select media items to delete.');
      return;
    }
    try {
      await dispatch(deleteManyMediaByIds(selectedMedia)).unwrap();
      setSelectedMedia([]); 
      dispatch(fetchMedia());
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const handleBulkUpdateCategory = async () => {
    if (selectedMedia.length === 0) {
      toast.warn('Please select media items to update.');
      return;
    }
    try {
      await dispatch(updateManyMediaByIds({ ids: selectedMedia, category: bulkUpdateCategory })).unwrap();
      setSelectedMedia([]); 
      dispatch(fetchMedia());
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  const handleBulkUpdateUsedIn = async () => {
    if (selectedMedia.length === 0) {
      toast.warn('Please select media items to update.');
      return;

    }
    dispatch(updateBulkMedia({ ids: selectedMedia, usedIn: bulkUpdateUsedIn }))
      .unwrap()
      .then(() => {
        setSelectedMedia([]);
        setBulkUpdateUsedIn([]);
        dispatch(fetchMedia());
        // console.log('Bulk update successful.');
      })
      .catch((error) => {
        console.error('Bulk update failed:', error);
        console.log ('Bulk update failed:', error);
      });
  };
  

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  const sortedAndFilteredMedia = media
    .filter((media: Media) => {
      const typeMatch = mediaTypeFilter === 'All' || media.type === mediaTypeFilter;
      const categoryMatch = categoryFilter === 'All' || media.category === categoryFilter;
      const nameMatch = media.name.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = !selectedDate || dayjs(media.lastUpdated || media.createdAt).isSame(selectedDate, 'day');
      

      return typeMatch && categoryMatch && nameMatch && dateMatch;
    })
    .sort((a: Media, b: Media) => {
       const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return dateB - dateA;
    });

  const categories = ['General', 'Casino Logos', 'Game Screenshots', 'Promotions', 'UI Elements'];
  const filterCategories = ['All', ...categories];

  return (
    <BlankCard>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "4px",
            bgcolor: primaryLight,
          }}
        >
          <Typography variant="h6" fontWeight={600} fontSize={18}>
            Media Library
          </Typography>
        </Box>
      <Box sx={{ p: 2 }}>
      <Paper  sx={{ p: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: isDragActive ? "2px dashed #2979ff" : "2px dashed grey",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            mb: 3,
            position: "relative",
            backgroundColor: isDragActive ? "#e3f2fd" : "transparent",
            cursor: "default",
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: "grey.500" }} />
          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Typography>Drag and drop files here</Typography>
          )}
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}
          >
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Upload Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Upload Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={open}>
              Select Files
            </Button>
          </Box>
          {uploadProgress !== null && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                p: 1,
              }}
            >
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography
                variant="body2"
                color="text.secondary"
              >{`Uploading... ${uploadProgress}%`}</Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          Media Filters
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            fullWidth
          />
          <FormControl variant="outlined" sx={{ minWidth: 120 }} fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={mediaTypeFilter}
              onChange={(e) => setMediaTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 120 }} fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              {filterCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={(newValue: Dayjs | null) => setSelectedDate(newValue)}
              renderInput={(params: TextFieldProps) => (
                <TextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 125 }}>
            <InputLabel>Update Category</InputLabel>
            <Select
              value={bulkUpdateCategory}
              onChange={(e) => setBulkUpdateCategory(e.target.value)}
              label="Update Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleBulkUpdateCategory}
            disabled={selectedMedia.length === 0 || !bulkUpdateCategory}
          >
            Update Category
          </Button>
          <FormControl variant="outlined" sx={{ minWidth: 180 }}>
            <InputLabel>Update Used In</InputLabel>
            <Select
              multiple
              value={bulkUpdateUsedIn}
              onChange={(e) => setBulkUpdateUsedIn(e.target.value as string[])}
              label="Update Used In"
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {["review", "Game", "Bonus", "CustomPage"].map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                  style={{
                    opacity: bulkUpdateUsedIn.indexOf(item) > -1 ? 0.5 : 1,
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleBulkUpdateUsedIn}
            disabled={
              selectedMedia.length === 0 || bulkUpdateUsedIn.length === 0
            }
          >
            Update Used In
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            disabled={selectedMedia.length === 0}
          >
            Delete Selected
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {sortedAndFilteredMedia.map((media: Media) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={media._id}>
                <Card
                  onClick={() => handleSelectMedia(media._id)}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    {media.type === "image" && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={`${backendUrl}/${media.url}`}
                        alt={media.name}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    {media.type === "video" && (
                      <CardMedia
                        component="video"
                        height="140px"
                        image={`${backendUrl}/${media.url}`}
                        title={media.name}
                        autoPlay
                        loop
                        muted
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    {media.type !== "image" && media.type !== "video" && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "grey.200",
                          flexDirection: "column",
                          height: "140px",
                        }}
                      >
                        <DescriptionIcon sx={{ fontSize: 48 }} />
                        <Typography variant="body2" mt={1}>
                          {media.type}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ overflow: "hidden" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      noWrap
                    >
                      {media.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {media.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Category: {media.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Used In:{" "}
                      {media.usedIn && media.usedIn.length > 0
                        ? media.usedIn.join(", ")
                        : "Not in use"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Author: {media.author?.name ?? "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated:{" "}
                      {formatDate(media.lastUpdated || media.createdAt)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <CustomCheckbox
                      checked={selectedMedia.includes(media._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const isChecked = e.target.checked;
                        setSelectedMedia((prevSelected) => {
                          const newSet = new Set(prevSelected);
                          if (isChecked) {
                            newSet.add(media._id);
                          } else {
                            newSet.delete(media._id);
                          }
                          return Array.from(newSet);
                        });
                      }}
                      color="primary"
                    />
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(media._id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      </Box>

    </BlankCard>
  );
};

export default MediaLibrary;
