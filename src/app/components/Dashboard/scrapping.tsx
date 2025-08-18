import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineOppositeContentClasses,
} from '@mui/lab';
import DashboardCard from '@/app/components/shared/DashboardCard';
import { Typography, Box, Avatar, useTheme } from '@mui/material';
import { 
    IconPlus, 
    IconRefresh, 
    IconUser,
    IconReport, 
    IconAlertTriangle,
    IconBuildingFortress,
    IconDeviceGamepad2,
} from '@tabler/icons-react';
import { sub } from 'date-fns';

// Mock data tailored to your casino scraping project
const updatesData = [
  {
    type: 'NEW_CASINOS',
    title: 'Added 12 New Casinos',
    details: 'Successfully scraped and added new casinos from the "Curacao eGaming" source.',
    icon: <IconBuildingFortress />,
    color: 'primary',
    timestamp: sub(new Date(), { hours: 1, minutes: 30 }),
  },
  {
    type: 'GAMES_UPDATE',
    title: 'Scraped 1,200+ Games',
    details: 'Completed a full scrape of games from the "Pragmatic Play" provider.',
    icon: <IconDeviceGamepad2 />,
    color: 'success',
    timestamp: sub(new Date(), { hours: 4, minutes: 15 }),
  },
  {
    type: 'JOB_FAILURE',
    title: 'Scraping Job Failed',
    details: 'The "Daily Bonus Sync" job failed due to a timeout error on the target server.',
    icon: <IconAlertTriangle />,
    color: 'error',
    timestamp: sub(new Date(), { hours: 8, minutes: 0 }),
  },
  {
    type: 'PROVIDER_UPDATE',
    title: 'Provider Data Refreshed',
    details: 'Updated logos and license information for 25 providers.',
    icon: <IconRefresh />,
    color: 'warning',
    timestamp: sub(new Date(), { hours: 15, minutes: 45 }),
  },
  {
    type: 'USER_ACTION',
    title: 'Manual Override by Admin',
    details: 'Admin user "methaq_admin" manually approved the "LeoVegas" casino entry.',
    icon: <IconUser />,
    color: 'info',
    timestamp: sub(new Date(), { days: 1, hours: 2, minutes: 0 }),
  },
  {
    type: 'REPORT_GENERATED',
    title: 'Weekly Report Generated',
    details: 'A new "Provider Game Count" report is available for download.',
    icon: <IconReport />,
    color: 'secondary',
    timestamp: sub(new Date(), { days: 2, hours: 5, minutes: 30 }),
  },
];


const Scrapping = () => {
    const theme = useTheme();

  return (
    <DashboardCard title="Recent Scraping Updates">
        <Box sx={{ p: 2 }}>
            <Timeline
                sx={{
                    p: 0,
                    [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                    minWidth: '150px'
                    },
                }}
            >
                {updatesData.map((update, index) => (
                    <TimelineItem key={update.title + index}>
                        <TimelineSeparator>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette[update.color as keyof typeof theme.palette] && typeof theme.palette[update.color as keyof typeof theme.palette] === 'object'
                                    ? (theme.palette[update.color as keyof typeof theme.palette] as any).light
                                    : 'grey.100',
                                color: theme.palette[update.color as keyof typeof theme.palette] && typeof theme.palette[update.color as keyof typeof theme.palette] === 'object'
                                    ? (theme.palette[update.color as keyof typeof theme.palette] as any).main
                                    : 'grey.800',
                                width: 40,
                                height: 40
                            }}
                        >
                            {update.icon}
                        </Avatar>
                        {index < updatesData.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{pt: 0, pl: 2}}>
                            <Typography fontWeight="600" variant='h6'>{update.title}</Typography>
                            <Typography variant='body2' color="text.secondary">{update.details}</Typography>
                            <Typography variant='caption' color="text.secondary">
                                {update.timestamp.toLocaleString()}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    </DashboardCard>
  );
};

export default Scrapping;