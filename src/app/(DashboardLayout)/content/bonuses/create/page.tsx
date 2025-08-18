'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CreateCasinoBonus from '@/app/components/apps/casino-bonuses/CreateCasinoBonuse';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/bonuses',
    title: 'Casino Bonuses',
  },
  {
    title: 'Create Bonus',
  },
];

const CreateCasinoBonusPage = () => {
  return (
    <PageContainer title="Create Casino Bonus" description="Create a single casino bonus.">
      <Breadcrumb title="Create Casino Bonus" items={BCrumb} />
      <Box mb={2}>
        <CreateCasinoBonus />
      </Box>
    </PageContainer>
  );
};

export default CreateCasinoBonusPage;