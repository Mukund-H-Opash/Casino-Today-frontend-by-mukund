
'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import { AppDispatch, RootState } from '@/store/store';
import { createUser } from '@/store/apps/users/userSlice';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  Button,
  Grid,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

const roles = ['admin', 'editor', 'subadmin', 'manager'] as const;
type Role = typeof roles[number];
type Status = 'active' | 'inactive' | 'pending' | 'blocked';

const CreateUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { isLoading, error } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('active');
  const [role, setRole] = useState<Role>('manager');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUserDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields: Name, Email, and Password.');
      return;
    }
    if (email && !emailRegex.test(email)) {
      toast.error('Please provide a valid email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    const result = await dispatch(
      createUser({
        name,
        email,
        password,
        phone,
        profileImage,
        status,
        role,
      })
    );

    if (createUser.fulfilled.match(result)) {
      toast.success('User created successfully!');
      router.push('/users');
    }
  };

  const handleTwoFactorToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setTwoFactorEnabled(event.target.checked);
  };

  return (
    <BlankCard>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          bgcolor: (theme) => theme.palette.primary.light,
        }}
      >
        <Typography variant="h6" fontWeight={800} fontSize={18}>
          Create New User
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BlankCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  bgcolor: (theme) => theme.palette.primary.light,
                }}
              >
                <Typography variant="h5" component="div">
                  User Details
                </Typography>
              </Box>
              <CardContent>
                <form onSubmit={handleUserDetailsSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                        <Avatar
                          src={previewImage || ''}
                          alt="User Profile"
                          sx={{ width: 170, height: 170, mb: 2 }}
                        />
                        <Button variant="contained" component="label">
                          Upload New Photo
                          <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            accept=".jpeg,.jpg,.png,.gif"
                          />
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                      <CustomTextField
                        id="name"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        fullWidth
                      />
                      <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                      <CustomTextField
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        fullWidth
                      />
                      <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                      <CustomTextField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        fullWidth
                      />
                      <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
                      <CustomTextField
                        id="phone"
                        value={phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                        fullWidth
                      />
                      <CustomFormLabel htmlFor="role">Role</CustomFormLabel>
                      <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          id="role"
                          value={role}
                          label="Role"
                          onChange={(event: SelectChangeEvent<Role>) =>
                            setRole(event.target.value as Role)
                          }
                        >
                          {roles.map((r) => (
                            <MenuItem key={r} value={r}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                      <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                          labelId="status-label"
                          id="status"
                          value={status}
                          label="Status"
                          onChange={(event: SelectChangeEvent<Status>) =>
                            setStatus(event.target.value as Status)
                          }
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="blocked">Blocked</MenuItem>
                        </Select>
                      </FormControl>
                     
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? <CircularProgress size={24} /> : 'Create User'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ ml: 2 }}
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </Box>
    </BlankCard>
  );
};

export default CreateUser;
