'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCustomPageById, clearCustomPage } from '@/store/apps/custom-pages/CustomPageSlice';
import SingleCustomPage from './SingleCustomPage';
import { Box, Typography, CircularProgress } from '@mui/material';

interface CustomSinglePageProps {
  slug: string;
}

const CustomSinglePage = ({ slug }: CustomSinglePageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { page, isLoading, error } = useSelector((state: RootState) => state.customPages);

  useEffect(() => {
    if (slug) {
      // console.log('Fetching page with slug:', slug);
      dispatch(fetchCustomPageById(slug));
    }
    return () => {
      dispatch(clearCustomPage());
    };
  }, [dispatch, slug]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress />
        <Typography>Loading custom page...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!page) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography>Custom page not found for slug: {slug}</Typography>
      </Box>
    );
  }

  return <SingleCustomPage customPage={page} />;
};

export default CustomSinglePage;