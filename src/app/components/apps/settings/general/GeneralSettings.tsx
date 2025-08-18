import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/system';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {  updateProfile, updatePassword } from '@/store/apps/settings/genrelsettingSlice';
import { getMe } from "@/store/apps/settings/genrelsettingSlice"; 
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material';


const GeneralSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
   const theme = useTheme();
   const primaryLight = theme.palette.primary.light;
  const { user, isLoading, error } = useSelector((state: RootState) => state.genrelsetting);
// console.log (user,'user');  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState<string | null> ('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageReset = () => {
    setSelectedImage(null);
    setImagePreview(user?.profileImage || null);
  };

  const handleSaveProfile = async () => {
    try {
      if (user && user._id) { // Ensure user and user._id exist
        await dispatch(updateProfile({ id: user._id, name, email, phone, profileImage: selectedImage || undefined })).unwrap();
      } else {
        toast.error('User ID not found. Unable to save profile.');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    try {
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              General Settings
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>

    <Grid container spacing={3}>
      {/* Change Profile */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <Box>
            <Typography variant="h5" mb={3} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px' } }>
              Change Profile
            </Typography>
            
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <Avatar
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${imagePreview}`}
                  alt={"user profile"}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
                <Stack direction="row" justifyContent="center" spacing={2} my={3}>
                  <Button variant="contained" color="primary" component="label">
                    Upload
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleImageReset}>
                    Reset
                  </Button>
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" mb={4}>
                  Allowed JPG, GIF or PNG.
                </Typography>
              </Box>
            </Box>
          </Box>
        </BlankCard>
      </Grid>
      {/*  Change Password */}  
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <Box>
            <Typography variant="h5" mb={0} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
              Change Password
            </Typography>
            <Box sx={{ p: 2 }}>
            <form>
              <CustomFormLabel
                sx={{
                  mt: 0,
                  
                }}
                htmlFor="text-cpwd"
              >
                Current Password
              </CustomFormLabel>
              <CustomTextField
                id="text-cpwd"
                value={currentPassword}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentPassword(e.target.value)}
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 2 */}
              <CustomFormLabel htmlFor="text-npwd">New Password</CustomFormLabel>
              <CustomTextField
                id="text-npwd"
                value={newPassword}
                onChange={(e: { target: { value: React.SetStateAction<string | null>; }; }) => setNewPassword(e.target.value)}
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 3 */}
              <CustomFormLabel htmlFor="text-conpwd">Confirm Password</CustomFormLabel>
              <CustomTextField
                id="text-conpwd"
                value={confirmPassword}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setConfirmPassword(e.target.value)}
                variant="outlined"
                fullWidth
                type="password"
              />
              <Button size="large" variant="contained" color="primary" onClick={handleChangePassword} sx={{ mt: 3 }}>
                Change Password
              </Button>
            </form>
            </Box>
          </Box>
        </BlankCard>
      </Grid>
      {/* Edit Details */}
      <Grid item xs={12}>
        <BlankCard>
          <Box>
            <Typography variant="h5" mb={0} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
              Personal Details
            </Typography>
            <Box sx={{ p: 2 }}>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-name"
                  >
                    Your Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-name"
                    value={name}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                
                
                
                <Grid item xs={12} sm={6}>
                  {/* 5 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-email"
                  >
                    Email
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-email"
                    value={email}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 6 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-phone"
                  >
                    Phone
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    value={phone}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPhone(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                
              </Grid>
            </form>
            </Box>
          </Box>
        </BlankCard>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
          <Button size="large" variant="contained" color="primary" onClick={handleSaveProfile}>
            Save
          </Button>
          <Button size="large" variant="text" color="error">
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
    </Box>
    </BlankCard>
  );
};

export default GeneralSettings;