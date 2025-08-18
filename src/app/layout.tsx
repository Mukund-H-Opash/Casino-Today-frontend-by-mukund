'use client';

import React, { useEffect } from "react";
import { ReactNode } from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) { 

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>

          <MyApp>{children}</MyApp>
        </Providers>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}

