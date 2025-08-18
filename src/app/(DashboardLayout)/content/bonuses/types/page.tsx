'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BonusTypes from '@/app/components/apps/casino-bonuses/Bonuse-types/BonusTypes';

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
    title: 'Bonus Types',
  },
];

const BonusTypesPage = () => {
  return (
    <PageContainer title="Bonus Types" description="Manage your list of bonus types.">
      <Breadcrumb title="Bonus Types Table" items={BCrumb} />
      <BonusTypes />
    </PageContainer>
  );
};

export default BonusTypesPage;
