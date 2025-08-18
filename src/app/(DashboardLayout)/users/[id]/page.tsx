'use client';
import React from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ViewUser from '@/app/components/apps/users/viewuser';

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
    title: 'View User',
  },
];

interface UserPageProps {
  params: {
    id: string;
  };
}

const UserPage = ({ params }: UserPageProps) => {
  const { id } = params;

  return (
    <PageContainer title="View User" description="View user details">
      <Breadcrumb title="View User" items={BCrumb} />
      <ViewUser userId={id} />
    </PageContainer>
  );
};

export default UserPage;

