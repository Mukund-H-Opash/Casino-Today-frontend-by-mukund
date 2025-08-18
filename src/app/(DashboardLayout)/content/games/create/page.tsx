'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import CreateCasinoGame from '@/app/components/apps/casino-games/CreateCasinoGame';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/games',
    title: 'Casino Games',
  },
  {
    title: 'Create Game',
  },
];

const CreateCasinoGamePage = () => {
  const params = useParams();

  return (
    <PageContainer title="Create Casino Game" description="Create a single casino Game.">
      <Breadcrumb title="Create Casino Game" items={BCrumb} />
      <Box mb={2}>
        <CreateCasinoGame/>
      </Box>
      
    </PageContainer>
  );
};

export default CreateCasinoGamePage;

