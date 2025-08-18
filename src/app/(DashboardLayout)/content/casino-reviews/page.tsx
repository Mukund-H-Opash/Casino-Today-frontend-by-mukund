'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import CasinoReviewsList from '@/app/components/apps/casino-reviews/CasinoReviewsList';
import { IconPlus } from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import Link from 'next/link';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Casino Reviews',
  },
];

const CasinoReviewsPage = () => {
  return (

    <PageContainer title="Casino Reviews" description="Manage your list of casino reviews.">
       <Breadcrumb title="Casino Reviews Table" items={BCrumb} />
        {/* <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            
        </Box> */}
        <CasinoReviewsList />
    </PageContainer>
  );
};

export default CasinoReviewsPage;


