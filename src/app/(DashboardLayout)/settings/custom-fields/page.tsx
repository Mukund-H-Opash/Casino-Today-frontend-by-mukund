'use client';
import React from 'react'
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFieldsSettings from '@/app/components/apps/settings/custom-fields/CustomFieldsSettings';


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
    title: 'Custom Fields Settings',
  },
];

const CustomFieldsSettingsPage = () => {
  return (
    <PageContainer title="  Custom Fields Settings" description="Manage your Custom Fields Settings.">
      <Breadcrumb title=" Custom Fields Settings " items={BCrumb} />
       <CustomFieldsSettings/>
   
    </PageContainer>
  );
};

export default CustomFieldsSettingsPage;  