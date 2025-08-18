'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import CasinoSingleBonus from '@/app/components/apps/casino-bonuses/CasinosingleBonuse';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';

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
    title: 'View Bonus',
  },
];

const ViewCasinoBonusPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <PageContainer title="View Casino Bonus" description="View a single casino bonus.">
      <Breadcrumb title="View Casino Bonus" items={BCrumb} />
      <CasinoSingleBonus id={slug} />
    </PageContainer>
  );
};

export default ViewCasinoBonusPage;