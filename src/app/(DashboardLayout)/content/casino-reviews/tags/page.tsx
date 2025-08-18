'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoTags from '@/app/components/apps/casino-reviews/casino-tags/CasinoTags';

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
    title: 'Casino Tags',
  },
];

const CasinoTagsPage = () => {
  return (
    <PageContainer title="Casino Tags" description="Manage your list of casino tags.">
      <Breadcrumb title="Casino Tags Table" items={BCrumb} />
      <CasinoTags />
    </PageContainer>
  );
};

export default CasinoTagsPage;


