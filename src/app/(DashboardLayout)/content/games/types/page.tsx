'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import dynamic from 'next/dynamic';
const GameTypes = dynamic(() => import('@/app/components/apps/casino-games/Game-typs/GameTypes'), { ssr: false });
// import CreateCasinoGame from '@/app/components/apps/casino-games/CreateCasinoGame';

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
    title: 'Game Types',
  },
];

const CasinoGameTypePage = () => {

  return (
    <PageContainer title=" Casino Game Types" description="Create a single casino Game Types.">
      <Breadcrumb title="Casino Game Types Table" items={BCrumb} />
      <GameTypes />
    </PageContainer>
  );
};

export default CasinoGameTypePage;