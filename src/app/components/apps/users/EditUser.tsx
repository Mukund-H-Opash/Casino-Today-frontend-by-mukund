
'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import { AppDispatch, RootState } from '@/store/store';
import {
  getUserById,
  updatebyid,
  updatepasswordbyadmin,
} from '@/store/apps/users/userSlice';
import { getPermissions, updatePermissions } from '@/store/apps/Permissions/PermissionSlice';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { toast } from 'react-toastify';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';

interface EditUserProps {
  userId: string;
}

interface PermissionState {
  [module: string]: { [permission: string]: boolean };
}

const moduleNameMapping: { [key: string]: string } = {
  dashboard: 'Dashboard',
  casinoReviews: 'Casino Reviews',
  games: 'Games',
  bonuses: 'Bonuses',
  customPages: 'Custom Page',
  media: 'Media',
  users: 'Users',
  activityLogs: 'Activity Logs',
};

const modules = [
  { name: 'Dashboard', permissions: ['view'] },
  { name: 'Custom Page', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Games', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Bonuses', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Casino Reviews', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Media', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Users', permissions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Activity Logs', permissions: ['view', 'create', 'edit', 'delete'] },
];

const roles = ['admin', 'editor', 'subadmin', 'manager'] as const;
type Role = typeof roles[number];
type Status = 'active' | 'inactive' | 'pending' | 'blocked';

const EditUser = ({ userId }: EditUserProps) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { user, isLoading: userLoading, error: userError } = useSelector(
    (state: RootState) => state.user
  );
  const {
    permissions: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useSelector((state: RootState) => state.permissions);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [reEnterPassword, setReEnterPassword] = useState<string>('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('active');
  const [role, setRole] = useState<Role>('manager');
  const [permissions, setPermissions] = useState<PermissionState>(() => {
    const initialState: PermissionState = {};
    modules.forEach(module => {
      initialState[module.name] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };
    });
    return initialState;
  });

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId))
        .unwrap()
        .catch((err) => {
          toast.error(err.message || 'Failed to fetch user data');
        });
      dispatch(getPermissions({ id: userId }))
        .unwrap()
        .then((response) => {
          if (response.permissions) {
            const permissionState = convertPermissionsToState(response.permissions);
            setPermissions(permissionState);
          }
        })
        .catch((err) => {
          toast.error(err.message || 'Failed to fetch permissions');
        });
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStatus((user.status as Status) || 'active');
      setRole((user.role as Role) || 'manager');
      setTwoFactorEnabled(user.twoFactorEnabled || false);
      if (user.profileImage) {
        setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profileImage}`);
      }
    }
  }, [user]);

  const convertPermissionsToState = (backendPermissions: PermissionState): PermissionState => {
    const state: PermissionState = {};

    modules.forEach(module => {
      state[module.name] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };
    });

    Object.entries(backendPermissions).forEach(([backendModule, perms]) => {
      const frontendModule = moduleNameMapping[backendModule] || backendModule;
      if (state[frontendModule]) {
        Object.entries(perms).forEach(([perm, value]) => {
          if (state[frontendModule][perm] !== undefined) {
            state[frontendModule][perm] = value;
          }
        });
      }
    });

    return state;
  };

  const convertStateToPermissions = (state: PermissionState): { [key: string]: { [key: string]: boolean } } => {
    const backendPermissions: { [key: string]: { [key: string]: boolean } } = {};
    Object.entries(state).forEach(([module, perms]) => {
      const backendModule =
        Object.keys(moduleNameMapping).find((key) => moduleNameMapping[key] === module) || module;
      backendPermissions[backendModule] = {};
      Object.entries(perms).forEach(([perm, enabled]) => {
        if (enabled) {
          backendPermissions[backendModule][perm] = true;
        }
      });
    });
    return backendPermissions;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handlePermissionChange = (module: string, permission: string, checked: boolean) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [permission]: checked,
      },
    });
  };

  const handleUserDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email && !emailRegex.test(email)) {
      toast.error('Please provide a valid email');
      return;
    }

    const result = await dispatch(
      updatebyid({
        id: userId,
        name,
        email,
        phone,
        profileImage: profileImage || undefined,
        status,
        role,
        twoFactorEnabled,
      })
    );

  };

  const handlePermissionsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const permissionsToUpdate = convertStateToPermissions(permissions);
    const result = await dispatch(
      updatePermissions({ id: userId, permissions: Object.entries(permissionsToUpdate).flatMap(([module, perms]) =>
        Object.entries(perms).filter(([, enabled]) => enabled).map(([perm]) => `${module}:${perm}`)
      ) })
    );

  };

  const handlePermissionsCancel = () => {
    router.push('/users');
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== reEnterPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    const result = await dispatch(
      updatepasswordbyadmin({ _id: userId, password: newPassword })
    );
  };

  const handleTwoFactorToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setTwoFactorEnabled(event.target.checked);
  };

  if (userLoading && !user) {
    return <CircularProgress />;
  }

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
          Edit {user?.name || 'User'}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* User Details Form */}
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
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            id="two-factor-switch"
                            checked={twoFactorEnabled}
                            onChange={handleTwoFactorToggle}
                          />
                        }
                        label="Enable 2FA"
                        sx={{ mt: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={userLoading}
                      >
                        {userLoading ? <CircularProgress size={24} /> : 'Save User Details'}
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

          {/* Permissions Form */}
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
                <Typography variant="h6" fontWeight={600}>
                  Edit Permissions
                </Typography>
              </Box>
              <CardContent>
                {permissionsError && <Alert severity="error">{permissionsError}</Alert>}
                {permissionsLoading ? (
                  <CircularProgress />
                ) : (
                  <form onSubmit={handlePermissionsSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <CustomFormLabel>Permissions</CustomFormLabel>
                        <TableContainer>
                          <Table
                            size="small"
                            sx={{ '& .MuiTableCell-root': { py: 1, px: 1 } }}
                          >
                            <TableHead>
                              <TableRow sx={{ bgcolor: (theme) => theme.palette.primary.light }}>
                                <TableCell sx={{ typography: 'body2' }}>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    Item
                                  </Typography>
                                </TableCell>
                                {['View', 'Create', 'Edit', 'Delete'].map((header) => (
                                  <TableCell
                                    key={header}
                                    align="center"
                                    sx={{ typography: 'body2' }}
                                  >
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      {header}
                                    </Typography>
                                  </TableCell>
                                ))}
                                <TableCell align="center" sx={{ typography: 'body2' }}>
                                  <FormControlLabel
                                    control={
                                      <CustomSwitch
                                        checked={modules.every((module) =>
                                          module.permissions.every(
                                            (perm) => permissions[module.name]?.[perm.toLowerCase()]
                                          )
                                        )}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                          const newValue = e.target.checked;
                                          setPermissions((prevPermissions) => {
                                            const newPermissions = { ...prevPermissions };
                                            modules.forEach((module) => {
                                                newPermissions[module.name] = { ...newPermissions[module.name] };
                                                module.permissions.forEach((perm) => {
                                                    newPermissions[module.name][perm.toLowerCase()] = newValue;
                                                });
                                            });
                                            return newPermissions;
                                          });
                                        }}
                                      />
                                    }
                                    label="Select All"
                                  />
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {modules.map((module) => (
                                <TableRow key={module.name}>
                                  <TableCell sx={{ typography: 'body2' }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      {module.name}
                                    </Typography>
                                  </TableCell>
                                  {['View', 'Create', 'Edit', 'Delete'].map((permission) => {
                                    const mappedPermission = permission.toLowerCase();
                                    const isPermissionAvailable = module.permissions.includes(
                                      mappedPermission
                                    );
                                    return (
                                      <TableCell
                                        key={permission}
                                        align="center"
                                        sx={{ typography: 'body2' }}
                                      >
                                        {isPermissionAvailable ? (
                                          <FormControlLabel
                                            control={
                                              <CustomSwitch
                                                id={`${module.name}-${permission}`}
                                                checked={
                                                  permissions[module.name]?.[mappedPermission] ||
                                                  false
                                                }
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                  handlePermissionChange(
                                                    module.name,
                                                    mappedPermission,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                            }
                                            label=""
                                          />
                                        ) : (
                                          <Typography variant="body2" color="textSecondary">
                                            -
                                          </Typography>
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                  <TableCell align="center" sx={{ typography: 'body2' }}>
                                    {module.permissions.length > 1 && (
                                      <FormControlLabel
                                        control={
                                          <CustomSwitch
                                            checked={module.permissions.every(
                                              (perm) =>
                                                permissions[module.name]?.[perm.toLowerCase()] ||
                                                false
                                            )}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                              const newValue = e.target.checked;
                                              setPermissions((prevPermissions) => ({
                                                ...prevPermissions,
                                                [module.name]: {
                                                  ...prevPermissions[module.name],
                                                  ...Object.fromEntries(
                                                    module.permissions.map((perm) => [
                                                      perm.toLowerCase(),
                                                      newValue,
                                                    ])
                                                  ),
                                                },
                                              }));
                                            }}
                                            disabled={module.permissions.length <= 1}
                                          />
                                        }
                                        label=""
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={permissionsLoading}
                        >
                          Save Permissions
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ ml: 2 }}
                          onClick={handlePermissionsCancel}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </CardContent>
            </BlankCard>
          </Grid>

          {/* Password Reset Form */}
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
                  Password Reset
                </Typography>
              </Box>
              <CardContent>
                <Typography color="textSecondary" mb={3}>
                  Set a new password for the user
                </Typography>
                <form onSubmit={handlePasswordReset}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="new-password">
                        New Password
                      </CustomFormLabel>
                      <CustomTextField
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewPassword(e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                      <CustomFormLabel sx={{ mt: 2 }} htmlFor="re-enter-password">
                        Re-enter New Password
                      </CustomFormLabel>
                      <CustomTextField
                        id="re-enter-password"
                        type="password"
                        value={reEnterPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReEnterPassword(e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={userLoading}
                      >
                        Reset Password
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

export default EditUser;
