'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import CasinoBonusesList from '@/app/components/apps/casino-bonuses/CasinoBonuseList';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/bonuses',
    title: 'Casino Bonuses',
  },
];

const CasinoBonusesPage = () => {
  return (
    <PageContainer title="Casino Bonuses" description="Manage your list of casino bonuses.">
      <Breadcrumb title="Casino Bonuses Table" items={BCrumb} />
      <CasinoBonusesList />
    </PageContainer>
  );
};

export default CasinoBonusesPage;