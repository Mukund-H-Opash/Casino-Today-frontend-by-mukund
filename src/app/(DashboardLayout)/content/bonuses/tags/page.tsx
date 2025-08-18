'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BonusTags from '@/app/components/apps/casino-bonuses/Bonuse-tags/BonusTags';

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
    title: 'Bonus Tags',
  },
];

const BonusTagsPage = () => {
  return (
    <PageContainer title="Bonus Tags" description="Manage your list of bonus tags.">
      <Breadcrumb title="Bonus Tags Table" items={BCrumb} />
      <BonusTags />
    </PageContainer>
  );
};

export default BonusTagsPage;
