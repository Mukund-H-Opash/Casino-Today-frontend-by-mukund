'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack } from '@mui/material';
import { loginUser } from '@/store/apps/auth/authSlice';
import { AppDispatch, RootState } from '@/store/store';

import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';

interface AuthLoginProps {
  subtitle?: React.ReactNode;
}


const AuthLogin = ({ subtitle }: AuthLoginProps) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  
  const { isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return; 
    }
    
    setFormErrors({});
    dispatch(loginUser({ email, password })).unwrap().then(() => {
    }).catch((error) => {
      toast.error(error);
    })
  };

  return (
    <>
      <Typography fontWeight="700" variant="h3" mb={1}>
        Welcome to CasinoToday
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px">Email Adddress</Typography>
            <CustomTextField 
              id="email" 
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Box>
          <Box mt="25px">
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px">Password</Typography>
            <CustomTextField 
              id="password" 
              type="password" 
              variant="outlined" 
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </Box>
        </Stack>
        <Box mt={3}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
        
      </form>
      {subtitle}
    </>
  );
};

export default AuthLogin;