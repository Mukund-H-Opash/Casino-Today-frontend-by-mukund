'use client';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import SingleCasinoBonus from "./SingleCasinoBonuse";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBonusById, clearBonus } from "@/store/apps/bonuses/bonuseSlice";
import { Bonus } from "@/store/apps/bonuses/bonuseSlice";

interface CasinoSingleBonusProps {
  id: string;
}

const CasinosingleBonuse = ({ id }: CasinoSingleBonusProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { bonus, isLoading, error } = useSelector((state: RootState) => state.bonus);


  useEffect(() => {
    if (id) {
      dispatch(fetchBonusById(id));
    }
    return () => {
      dispatch(clearBonus());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Casino Bonus...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!bonus) {
    return <Typography>Bonus not found for id: {id}</Typography>;
  }

  return <SingleCasinoBonus bonus={bonus} />;
};

export default CasinosingleBonuse;