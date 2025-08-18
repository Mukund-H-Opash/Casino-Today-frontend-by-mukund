'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import SeoSettings from '@/app/components/apps/settings/seo/SeoSettings';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    // to: '/Settings',
    title: 'Settings',
  },
  {
    title: 'SEO Settings',
  },
];

const SeoSettingsPage = () => {
  return (
    <PageContainer title="  Seo Settings" description="Manage your Seo Settings.">
      <Breadcrumb title=" Seo Settings" items={BCrumb} />
   
       <SeoSettings/>
      
    </PageContainer>
  );
};

export default SeoSettingsPage;  