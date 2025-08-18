'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
// import CasinoReviewsList from '@/app/components/apps/casino-reviews/CasinoReviewsList';
import { IconPlus } from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import GameFeatures from '@/app/components/apps/casino-games/Game-features/GameFeatures';


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
    title: 'Games features',
  },
];



const CasinoGamesFeaturesPage = () => {
  return (

    <PageContainer title="Casino Games Features" description="Manage your list of casino Games Features.">
       <Breadcrumb title="Casino Games Features Table" items={BCrumb} />
        <GameFeatures />
    </PageContainer>
  );
};

export default CasinoGamesFeaturesPage;




