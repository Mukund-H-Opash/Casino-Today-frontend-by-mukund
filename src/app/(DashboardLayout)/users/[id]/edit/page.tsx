'use client';
import React from 'react';
import EditUser from '@/app/components/apps/users/EditUser';
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
    title: 'Edit User',
  },
];

interface EditUserPageProps {
  params: {
    id: string;
  };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const { id } = params;

return (
  <PageContainer title="Edit User" description="Edit user details">
    <Breadcrumb title="Edit User" items={BCrumb} />
     <EditUser userId={id} />
  </PageContainer>
);
};

export default EditUserPage;








