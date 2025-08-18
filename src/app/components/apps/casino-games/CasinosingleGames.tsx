"use client";
import React, { useEffect } from "react";
import SingleCasinoGame from "./SingleCasinoGame";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchGameById, clearGame } from "@/store/apps/games/gameSlice";

interface CasinoSingleGameProps {
  slug: string;
}

const CasinoSingleGame = ({ slug }: CasinoSingleGameProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { game: gameData, isLoading, error } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    if (slug) {
      dispatch(fetchGameById(slug));
    }
    return () => {
      dispatch(clearGame());
    };
  }, [dispatch, slug]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Casino Game...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!gameData) {
    return <div>Casino game not found for id: {slug}</div>;
  }

  const gameForSingleGame = {
    ...gameData,
    softwareProvider: gameData.softwareProvider || { _id: '', name: 'N/A' },
    gameType: gameData.gameType || { _id: '', name: 'N/A' },
    tags: gameData.tags || [],
  };

  return <SingleCasinoGame game={gameForSingleGame} />;
};

export default CasinoSingleGame;


