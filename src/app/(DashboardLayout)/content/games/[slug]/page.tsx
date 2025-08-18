'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import CasinoSingleGame from '@/app/components/apps/casino-games/CasinosingleGames';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/games',
    title: 'Casino games',
  },
  {
    title: 'View game',
  },
];

const ViewCasinogamePage = () => {
  const params = useParams();
  const id = params.slug as string; // Changed from slug to id

  return (
    <PageContainer title="View Casino game" description="View a single casino game.">
      <Breadcrumb title="View Casino game" items={BCrumb} />
      <CasinoSingleGame slug={id} />
    </PageContainer>
  );
};

export default ViewCasinogamePage;