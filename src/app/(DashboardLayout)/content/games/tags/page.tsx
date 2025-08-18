'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import GameTags from '@/app/components/apps/casino-games/Game-tags/GameTags';
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
    title: 'Game Tags',
  },
];

const CasinoGameTagPage = () => {

  return (
    <PageContainer title="Casino Game Tag" description="Manage your list of casino Game Tags.">
      <Breadcrumb title="Casino Game Tag Table" items={BCrumb} />
      <GameTags />
    </PageContainer>
  );
};

export default CasinoGameTagPage;

