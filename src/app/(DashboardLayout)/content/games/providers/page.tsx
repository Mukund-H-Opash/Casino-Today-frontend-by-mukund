'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import SoftwareProviders from '@/app/components/apps/casino-games/Software-provider/SoftwareProviders';
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
    title: 'Software Providers',
  },
];

const SoftwareProvidersPage = () => {

  return (
    <PageContainer title="Casino Games Software Providers" description="Manage your list of Software Providers.">
      <Breadcrumb title="Casino Games Software Providers Table" items={BCrumb} />
      <SoftwareProviders />
    </PageContainer>
  );
};

export default SoftwareProvidersPage;

