'use client'
import React, { useEffect } from 'react';
import Image from "next/image";
import { Box, CardContent, Grid, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDashboardMetrics } from '@/store/apps/Dashboard/DashboardSlice';
import socket from '@/utils/socket'; 
import { updateMetrics } from '@/store/apps/Dashboard/DashboardSlice';

const TopCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);
   useEffect(() => {
    const handleMetricsUpdate = (metrics: any) => {
      dispatch(updateMetrics(metrics));
    };
    socket.on('dashboardMetrics', handleMetricsUpdate);

    return () => {
      socket.off('dashboardMetrics', handleMetricsUpdate);
    };
  }, [dispatch]);


  const topcards = data ? [
    {
      icon: '/images/svgs/icon-dd-invoice.svg',
      title: "Casinos",
      digits: data.casinos.toString(),
      bgcolor: "primary",
    },
    {
      icon: '/images/svgs/icon-dd-lifebuoy.svg',
      title: "Games",
      digits: data.games.toString(),
      bgcolor: "warning",
    },
    {
      icon: '/images/svgs/earth.svg',
      title: "Countries",
      digits: data.countries.toString(),
      bgcolor: "secondary",
    },
    {
      icon: '/images/svgs/icon-favorites.svg',
      title: "Providers",
      digits: data.providers.toString(),
      bgcolor: "error",
    },
    {
      icon: '/images/svgs/icon-speech-bubble.svg',
      title: "Bonuses",
      digits: data.bonuses.toString(),
      bgcolor: "success",
    },
  ] : [];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2.4} key={i}>
          <Box bgcolor={topcard.bgcolor + ".light"} height={"100%" } width={"100%" }>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flexGrow: 1, pr: 2 }}>
                <Typography
                  color={topcard.bgcolor + ".main"}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography
                  color={topcard.bgcolor + ".main"}
                  variant="h4"
                  fontWeight={600}
                >
                  {topcard.digits}
                </Typography>
              </Box>
              <Image src={topcard.icon} alt={"topcard.icon"} width="50" height="50" />
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCard;

