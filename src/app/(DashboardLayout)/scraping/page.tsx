'use client';
import React from 'react';
import { Box, SelectChangeEvent, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
// import ScrapingList from '@/app/components/apps/scraping/ScrapingList';



const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/scraping',
    title: ' CSV Scraping',
  },
];

const CSVScrapingPage = () => {
  return (
    <PageContainer title="  CSV Scraping" description="Manage your CSV Scraping.">
      <Breadcrumb title=" CSV Scraping Table" items={BCrumb} />
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">CSV Scraping </Typography>
      </Box>
      {/* <ScrapingList/> */}
    </PageContainer>
  );
};

export default CSVScrapingPage;  