'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoLanguages from '@/app/components/apps/casino-reviews/casino-languages/CasinoLanguages';

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
    title: 'Casino Languages',
  },
];

const CasinoLanguagesPage = () => {
  return (
    <PageContainer title="Casino Languages" description="Manage your list of casino Languages.">
      <Breadcrumb title="Casino Languages Table" items={BCrumb} />
      <CasinoLanguages />
    </PageContainer>
  );
};

export default CasinoLanguagesPage;


