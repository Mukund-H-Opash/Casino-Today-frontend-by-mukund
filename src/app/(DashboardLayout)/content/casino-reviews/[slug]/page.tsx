'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import CasinosingleReviews from '@/app/components/apps/casino-reviews/CasinosingleReviews';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';

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
    title: 'View Review',
  },
];

const ViewCasinoReviewPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <PageContainer title="View Casino Review" description="View a single casino review.">
      <Breadcrumb title="View Casino Review" items={BCrumb} />
      <CasinosingleReviews slug={slug} />
    </PageContainer>
  );
};

export default ViewCasinoReviewPage;
