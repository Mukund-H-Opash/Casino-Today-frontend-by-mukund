'use client'
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import CasinoGamesList from '@/app/components/apps/casino-games/CasinoGamesList';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';



const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  { 
    to: '/content/games',
    title: 'Casino Games',
  }
];



const CasinoGamesPage = () => {
  return (

    <PageContainer title="Casino Games" description="Manage your list of casino Games.">
       <Breadcrumb title="Casino Games Table" items={BCrumb} />
        <CasinoGamesList />
    </PageContainer>
  );
};

export default CasinoGamesPage;


