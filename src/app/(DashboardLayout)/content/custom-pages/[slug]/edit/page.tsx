'use client';
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCustomPageById, clearCustomPage } from '@/store/apps/custom-pages/CustomPageSlice';
import EditCasinoCustom from '@/app/components/apps/custom-pages/EditCustomPage';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/custom-pages',
    title: 'Casino Custom Pages',
  },
  {
    title: 'Edit Custom Page',
  },
];

const EditCasinoCustomPage = () => {
  const params = useParams();
  const slug = params.slug as string;
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
      <PageContainer title="Edit Casino Custom Page" description="Edit a single casino custom page.">
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress />
          <Typography>Loading custom page...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Edit Casino Custom Page" description="Edit a single casino custom page.">
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!page) {
    return (
      <PageContainer title="Edit Casino Custom Page" description="Edit a single casino custom page.">
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography>Custom page not found for slug: {slug}</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Casino Custom Page" description="Edit a single casino custom page.">
      <Breadcrumb title="Edit Casino Custom Page" items={BCrumb} />
      <Box mb={2}>
        <EditCasinoCustom customPage={page} />
      </Box>
    </PageContainer>
  );
};

export default EditCasinoCustomPage;