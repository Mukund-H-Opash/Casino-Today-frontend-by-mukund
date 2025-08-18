'use client'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react';

import PageContainer from '@/app/components/container/PageContainer';
import TopCards from '../components/Dashboard/TopCards';
import RecentUpdatesTable from '../components/Dashboard/RecentUpdates';
import Scrapping from '../components/Dashboard/scrapping';


export default function Dashboard (){

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
      <Grid container spacing={3}>

            <Grid item xs={12} lg={12}>
              <TopCards />
            </Grid>

            <Grid item xs={12}>
            <RecentUpdatesTable />
            </Grid>


            <Grid item xs={12} lg={12}>
              <Scrapping/>
            </Grid>

        </Grid>
      </Box>
    </PageContainer>
  )
}
