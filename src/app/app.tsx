"use client";
import React, { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(DashboardLayout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector, useDispatch } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { AppState } from "@/store/store";
import "@/utils/i18n";
import "@/app/api/index";
import { checkAuth } from '@/store/apps/auth/authSlice';
import socket from '@/utils/socket';
import { addAccessLog, AccessLog } from "@/store/apps/accesslogs/accesslogSlice"; 


const MyApp = ({ children }: { children: ReactNode }) => {
    const theme = ThemeSettings();
    const customizer = useSelector((state: AppState) => state.customizer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth() as any);
    }, [dispatch]);

    useEffect(() => {
        socket.connect();
    
        const handleNewLog = (log: AccessLog) => {
          console.log('Received new activity log from server:', log);
          dispatch(addAccessLog(log));
        };
    
        socket.on('newActivityLog', handleNewLog);
        return () => {
          socket.off('newActivityLog', handleNewLog);
          
          socket.disconnect();
        };
      }, [dispatch]); 

    return (
        <>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <RTL direction={customizer.activeDir}>
                        <CssBaseline />
                        {children}
                    </RTL>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    );
};

export default MyApp;
