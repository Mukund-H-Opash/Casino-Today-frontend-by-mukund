'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import UserManagement from '@/app/components/apps/users/UserManagement';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/users',
    title: 'Users',
  },
];

const UsersPage = () => {
  return (
    <PageContainer title="  Users" description="Manage your list of  Users.">
      <Breadcrumb title=" Users Table" items={BCrumb} />
      <UserManagement />
    
    </PageContainer>
  );
};

export default UsersPage;  