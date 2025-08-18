'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
// import CreateCasinoBonus from '@/app/components/apps/bonuses/CreateCasinoBonuse';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/payment-methods',
    title: 'Payment Methods',
  },
];

const CasinoPaymentMethodsPage = () => {
  return (
    <PageContainer title=" Casino Payment Methods" description="Manage your list of casino Payment Methods.">
      <Breadcrumb title="Casino Payment Methods Table" items={BCrumb} />
      <Box mb={2}>
        {/* <CreateCasinoTypes /> */}
      </Box>
    </PageContainer>
  );
};

export default CasinoPaymentMethodsPage;