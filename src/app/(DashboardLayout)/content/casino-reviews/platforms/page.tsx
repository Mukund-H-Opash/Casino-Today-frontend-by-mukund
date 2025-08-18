'use client'
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoPlatforms from '@/app/components/apps/casino-reviews/casino-platfroms/CasinoPlatfroms';

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
    title: 'Casino Platforms',
  },
];



const CasinoPlatformsPage = () => {
  return (

    <PageContainer title="Casino Platforms" description="Manage your list of casino Platforms.">
       <Breadcrumb title="Casino Platforms Table" items={BCrumb} />
        <CasinoPlatforms />
    </PageContainer>
  );
};

export default CasinoPlatformsPage;


