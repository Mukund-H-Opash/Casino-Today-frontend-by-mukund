'use client'
import React from 'react';
import CreateUser from '@/app/components/apps/users/CreateUser';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        to: '/users',
        title: 'Users',
    },
    {
        title: 'Create User',
    },
];

const CreateUserPage = () => {
  return (
    <PageContainer title=" Create User" description="Create a single user.">
      <Breadcrumb title=" Create User" items={BCrumb} />
      <CreateUser />
    
    </PageContainer>
  );
};

export default CreateUserPage;  
