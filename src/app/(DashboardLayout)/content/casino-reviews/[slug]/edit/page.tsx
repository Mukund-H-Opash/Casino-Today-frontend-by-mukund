'use client';
import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import EditCasinoReview from '@/app/components/apps/casino-reviews/EditCasinoReview'; 

// --- Import Redux hooks and actions ---
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCasinoById, clearCasino, fetchCasinoReviewData } from '@/store/apps/casinoReview/casinoSlice';

const EditCasinoPage = () => {
  const params = useParams();
  const casinoId = params.slug as string; 


  const dispatch: AppDispatch = useDispatch();
  const { casino, isLoading, error, reviewData } = useSelector((state: RootState) => state.casinos);

  // Fetch the casino data when the component mounts
  useEffect(() => {
    if (casinoId) {
      dispatch(fetchCasinoById(casinoId));
      dispatch(fetchCasinoReviewData());
    }

    // Cleanup function to clear the casino state when the component unmounts
    return () => {
      dispatch(clearCasino());
    };
  }, [dispatch, casinoId]);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/content/casino-reviews', title: 'Casino Reviews' },
    { title: 'Edit Review' },
  ];

  return (
    <PageContainer title="Edit Casino Review" description="Edit an existing casino review.">
      <Breadcrumb title={"Edit Casino Review"} items={BCrumb} />
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading casino data: {error}
        </Typography>
      ) : casino ? (
        <Box mt={2}>
          <EditCasinoReview review={{
            ...casino,
            tags: casino.tags.map(tag => tag._id),
            withdrawalTimes: casino.withdrawalTimes.join('\n'),
            withdrawalLimits: casino.withdrawalLimits.join('\n'),
          }} reviewData={reviewData} />
        </Box>
      ) : null}
    </PageContainer>
  );
};

export default EditCasinoPage;
