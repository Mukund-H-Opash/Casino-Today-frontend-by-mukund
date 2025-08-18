'use client';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CasinoCustomPagesList from '@/app/components/apps/custom-pages/CustomPageList';
import Link from 'next/link';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/custom-pages',
    title: 'Custom Pages',
  },
];

const CasinoCustomPage = () => {
  return (
    <PageContainer title=" Casino Custom Pages" description="Manage your list of casino Custom Pages.">
      <Breadcrumb title="Casino Custom Pages Table" items={BCrumb} />
      <CasinoCustomPagesList />
    </PageContainer>
  );
};

export default CasinoCustomPage;