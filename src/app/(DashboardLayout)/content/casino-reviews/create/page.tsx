'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import CreateCasinoReview from '@/app/components/apps/casino-reviews/CreateCasinoReview';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/casino-reviews',
    title: 'Casino Reviews',
  },
  {
    title: 'Create Review',
  },
];

const CreateCasinoReviewPage = () => {
  const params = useParams();

  return (
    <PageContainer title="Create Casino Review" description="Create a single casino review.">
      <Breadcrumb title="Create Casino Review" items={BCrumb} />
      <Box mb={2}>
        <CreateCasinoReview/>
      </Box>
      
    </PageContainer>
  );
};

export default CreateCasinoReviewPage;

