'use client';
import React from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import CustomSinglePage from '@/app/components/apps/custom-pages/CustomSinglePage';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/custom-pages',
    title: 'Casino Custom Pages',
  },
  {
    title: 'View Custom Page',
  },
];

const ViewCasinoCustomPage = () => {
  const params = useParams();
  // console.log(params,'params');
  const slug = params.slug as string;
  // console.log(slug,'slug from params');


  return (
    <PageContainer title="View Casino Custom Page" description="View a single casino custom page.">
      <Breadcrumb title="View Casino Custom Page" items={BCrumb} />
      <Box mb={2}>
        <CustomSinglePage slug={slug} />
      </Box>
    </PageContainer>
  );
};

export default ViewCasinoCustomPage;