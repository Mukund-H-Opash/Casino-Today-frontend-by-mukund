'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoLicences from '@/app/components/apps/casino-reviews/casino-licences/CasinoLicences';

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
    title: 'Casino Licences',
  },
];

const CasinoLicencesPage = () => {
  return (
    <PageContainer title="Casino Licences" description="Manage your list of casino Licences.">
      <Breadcrumb title="Casino Licences Table" items={BCrumb} />
      <CasinoLicences />
    </PageContainer>
  );
};

export default CasinoLicencesPage;


