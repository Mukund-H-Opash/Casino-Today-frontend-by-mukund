'use client';
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import EditCasinoGame from '@/app/components/apps/casino-games/EditCasinoGame';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import {  useSelector } from '@/store/hooks'; 
import { useAppDispatch } from '@/store/store';
import { RootState } from '@/store/store';
import { fetchGameById, clearGame } from '@/store/apps/games/gameSlice'; 

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/content/games',
    title: 'Casino Games',
  },
  {
    title: 'Edit Game',
  },
];

const EditCasinoGamePage = () => {
  const params = useParams();
  const id = params.slug as string; 
  const dispatch = useAppDispatch();
  const { game, isLoading, error } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    if (id) {
      dispatch(fetchGameById(id));
    }
    return () => {
      dispatch(clearGame()); 
    };
  }, [dispatch, id]);

  return (
    <PageContainer title="Edit Casino Game" description="Edit a single casino game.">
      <Breadcrumb title="Edit Casino Game" items={BCrumb} />
      <Box mb={2}>
        <EditCasinoGame game={game} isLoading={isLoading} error={error} />
      </Box>
    </PageContainer>
  );
};

export default EditCasinoGamePage;