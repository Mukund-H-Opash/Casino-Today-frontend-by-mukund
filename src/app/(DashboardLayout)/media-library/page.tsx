'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import MediaLibrary from '@/app/components/apps/media-library/media-library';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/media-library',
    title: 'Media Library',
  },
];

const MediaLibraryPage = () => {
  return (
    <PageContainer title="  Media Library" description="Manage your list of  Media Library.">
      <Breadcrumb title=" Media Library Table" items={BCrumb} />
      <MediaLibrary />
    </PageContainer>
  );
};

export default MediaLibraryPage;  