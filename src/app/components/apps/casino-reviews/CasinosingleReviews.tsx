"use client";
import React, { useEffect, useState } from "react";
import SingleCasinoReview from "./SingleCasinoReview";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCasinoById, clearCasino, fetchCasinoReviewData } from "@/store/apps/casinoReview/casinoSlice";

interface CasinosingleReviewsProps {
  slug: string; 
}

const CasinosingleReviews = ({ slug }: CasinosingleReviewsProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { casino: review, isLoading, error, reviewData: lookupData } = useSelector((state: RootState) => state.casinos);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCasinoById(slug));
      dispatch(fetchCasinoReviewData()); // Fetch comprehensive lookup data
    }
    return () => {
      dispatch(clearCasino());
    };
  }, [dispatch, slug]);

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Casino Review...</Typography>
        </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!review) {
    return <div>Casino review not found for id: {slug}</div>;
  }


  return <SingleCasinoReview review={review} reviewData={lookupData} />;
};

export default CasinosingleReviews;

