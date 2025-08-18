'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CreateCasinoCustom from '@/app/components/apps/custom-pages/CreateCustomPage';

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
    title: 'Create Custom Page',
  },
];

const CreateCasinoCustomPage = () => {
  return (
    <PageContainer title="Create Casino Custom Page" description="Create a single casino custom page.">
      <Breadcrumb title="Create Casino Custom Page Table" items={BCrumb} />
      <Box mb={2}>
        <CreateCasinoCustom />
      </Box>
    </PageContainer>
  );
};

export default CreateCasinoCustomPage;