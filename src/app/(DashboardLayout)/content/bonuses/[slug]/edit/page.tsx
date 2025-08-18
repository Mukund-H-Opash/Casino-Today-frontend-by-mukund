'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchBonusById, clearBonus } from '@/store/apps/bonuses/bonuseSlice';
import EditCasinoBonus from '@/app/components/apps/casino-bonuses/EditCasinoBonuse';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

interface EditPageProps {
  params: {
    slug: string;
  };
}

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/bonuses',
    title: 'Casino Bonuses',
  },
  {
    title: 'Edit Bonus',
  },
];

const EditPage = ({ params }: EditPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { bonus, isLoading, error } = useSelector((state: RootState) => state.bonus);

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchBonusById(params.slug));
    }

    return () => {
      dispatch(clearBonus());
    };
  }, [dispatch, params.slug]);

    return (
      <PageContainer title="Edit Casino Bonus" description="Edit a single casino bonus.">
        <Breadcrumb title="Edit Casino Bonus" items={BCrumb} />
        <EditCasinoBonus bonus={bonus} isLoading={isLoading} error={error} />
      </PageContainer>
    );
};

export default EditPage;



