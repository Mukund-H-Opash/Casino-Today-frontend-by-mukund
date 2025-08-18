'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import GeneralSettings from '@/app/components/apps/settings/general/GeneralSettings';


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
    title: 'General Settings',
  },
];

const GeneralSettingsPage = () => {
  return (
    <PageContainer title="  General Settings" description="Manage your General Settings.">
      <Breadcrumb title=" General Settings " items={BCrumb} />
      <GeneralSettings />
    </PageContainer>
  );
};

export default GeneralSettingsPage;  