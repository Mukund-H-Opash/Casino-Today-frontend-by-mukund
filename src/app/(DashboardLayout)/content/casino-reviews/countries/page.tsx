'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoCountries from '@/app/components/apps/casino-reviews/casino-countries/CasinoCountries';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/casino-reviews',
    title: 'Casino Reviews',
  },
  {
    title: 'Casino Countries',
  },
];

const CasinoCountriesPage = () => {
  return (
    <PageContainer title="Casino Countries" description="Manage your list of casino Countries.">
      <Breadcrumb title="Casino Countries Table" items={BCrumb} />
      <CasinoCountries />
    </PageContainer>
  );
};

export default CasinoCountriesPage;


