'use client';
import React, { MouseEvent, ChangeEvent, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  useTheme,
  Avatar,
  CardContent,
  TableSortLabel,
  Paper,
  TablePagination,
  FormControlLabel,
  Alert,
  CircularProgress,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '@/store/hooks';
import { getAccessLogById } from '@/store/apps/accesslogs/accesslogSlice';
import { AppDispatch, RootState } from '@/store/store';
import { getPermissions } from '@/store/apps/Permissions/PermissionSlice';
import { User } from '@/store/apps/users/userSlice';
import { toast } from 'react-toastify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from 'next/link';
import { IconEdit } from '@tabler/icons-react';

interface PermissionState {
  [module: string]: { [permission: string]: boolean };
}

interface Log {
  id: number;
  username: string;
  action: string;
  date: string;
}

interface SingleUserProps {
  user: User;
  
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

const activityLogHeadCells = [
  { id: 'expand', numeric: false, disablePadding: false, label: '' },
  { id: 'username', numeric: false, disablePadding: false, label: 'USER' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
  { id: 'details', numeric: false, disablePadding: false, label: 'DETAILS' },
  { id: 'date', numeric: false, disablePadding: false, label: 'DATE' },
];

function AccessLogCollapsibleRow(props: { log: any }) {
  const { log } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const isCollapsible = log.details?.changedFields && log.details.changedFields.length > 0;

    const getActionChipColor = (action: string) => {
      if (action === 'create') {
        return {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        };
      } else if (action === 'update') {
        return {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        };
      } else if (action === 'delete') {
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        };
      } else if (action === 'login') {
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        };
      } else {
        return {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.main,
        };
      }
    };

  const renderValue = (value: any, fieldName?: string) => {
    if (Array.isArray(value)) {
      return (
        <Box sx={{ ml: 2 }}>
          {value.length > 0 ? (
            value.map((item: any, index: number) => {
              if (fieldName === 'faq' && typeof item === 'object' && item !== null && 'question' in item && 'answer' in item) {
                return (
                  <Typography key={index} variant="subtitle2" color="textSecondary" sx={{ ml: 1, display: 'list-item' }}>
                    {`Question: ${item.question} - Answer: ${item.answer}`}
                  </Typography>
                );
              }
              return (
                <Typography key={index} variant="subtitle2" color="textSecondary" sx={{ ml: 1, display: 'list-item' }}>
                  {typeof item === 'object' ? JSON.stringify(item) : item}
                </Typography>
              );
            })
          ) : (
            <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
              (Empty)
            </Typography>
          )}
        </Box>
      );
    } else if (typeof value === 'object' && value !== null) {
      // New logic for handling message field
      if ('message' in value && typeof value.message === 'string') {
        return (
          <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
            {value.message}
          </Typography>
        );
      }
      // Fallback to existing logic for other objects
      return (
        <Box sx={{ ml: 2 }}>
          {Object.entries(value).map(([key, val]) => (
            <Typography key={key} variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
              {`${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`}
            </Typography>
          ))}
        </Box>
      );
    }
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {value !== null && value !== undefined ? String(value) : 'N/A'}
      </Typography>
    );
  };

  const renderChangedFields = (changedFields: any[]) => {
    return changedFields.map((field: any, index: number) => {
      if (field.field === 'permissions') {
        const oldPerms = field.oldValue || {};
        const newPerms = field.newValue || {};
        const permissionChanges: JSX.Element[] = [];

        // Show all permissions with their old and new values, not just changes
        for (const moduleName in newPerms) {
          if (newPerms.hasOwnProperty(moduleName)) {
            const oldModulePerms = oldPerms[moduleName] || {};
            const newModulePerms = newPerms[moduleName] || {};
            const modulePermissions: JSX.Element[] = [];

            for (const permType of ['view', 'create', 'edit', 'delete']) {
              const oldValue = oldModulePerms[permType] !== undefined ? oldModulePerms[permType] : false;
              const newValue = newModulePerms[permType] !== undefined ? newModulePerms[permType] : false;
              modulePermissions.push(
                <Typography key={`${moduleName}-${permType}`} variant="subtitle2" color="textSecondary" sx={{ ml: 2 }}>
                  {`${permType}: ${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`}
                </Typography>
              );
            }
            permissionChanges.push(
              <Box key={`${moduleName}-${index}`}>
                <Typography variant="subtitle2" fontWeight={600} color="textSecondary" sx={{ ml: 1 }}>
                  {moduleName}:
                </Typography>
                {modulePermissions}
              </Box>
            );
          }
        }
        return (
          <Box key={index}>
            <Typography variant="subtitle2" fontWeight={600} color="textSecondary">
              Permissions Changes:
            </Typography>
            {permissionChanges.length > 0 ? permissionChanges : (
              <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 2 }}>
                No specific permission changes detected.
              </Typography>
            )}
          </Box>
        );
      } else {
        return (
          <Box key={index} sx={{ mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: '4px', p: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              {field.field}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                  Old Value
                </Typography>
                <Box
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    p: 2.5,
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  {renderValue(field.oldValue, field.field)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                  New Value
                </Typography>
                <Box
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    p: 2.5,
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  {renderValue(field.newValue, field.field)}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      }
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {isCollapsible && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell padding="normal">
          <Typography variant="subtitle1" fontWeight={600}>
            {log.user?.name || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell padding="normal">
          <Chip
            label={log.action}
            size="small"
            sx={getActionChipColor(log.action)}
          />
        </TableCell>
        <TableCell padding="normal">
          {typeof log.details === 'string' ? (
            <Typography variant="subtitle2" color="textSecondary">
              {log.details}
            </Typography>
          ) : (
            isCollapsible ? (
              <Typography variant="subtitle2" color="textSecondary">
                {log.details.changedFields.length > 1
                  ? 'Multiple changes'
                  : 'View details'}{' '}
                (click to expand)
              </Typography>
            ) : (
              <Typography variant="subtitle2" color="textSecondary">
                {log.details?.message || log.details?.requestUrl || 'N/A'}
              </Typography>
            )
          )}
        </TableCell>
        <TableCell padding="normal">
          <Typography variant="subtitle2" color="textSecondary">
            {log.createdAt
              ? new Date(log.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }).replace(/\//g, '-')
              : 'N/A'}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow sx={{ '& > .MuiTableCell-root': { borderBottom: 'none' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: theme.palette.grey[100], padding: 2, borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
                Change Details
              </Typography>
              {log.details?.changedFields && log.details.changedFields.length > 0 ? (
                renderChangedFields(log.details.changedFields)
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No detailed changes available.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const SingleUser = ({ user }: SingleUserProps) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const primaryLight = theme.palette.primary.light;

  const { permissions: permissionsData, isLoading: permissionsLoading, error: permissionsError } =
    useSelector((state: RootState) => state.permissions);
  const { userAccessLogs, loading: accessLogsLoading } = useSelector((state: RootState) => state.accesslogs);

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
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled || false);
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLogRowsPerPage = localStorage.getItem('singleUserLogRowsPerPage');
      return storedLogRowsPerPage ? parseInt(storedLogRowsPerPage, 10) : 25;
    }
    return 5;
  });

  useEffect(() => {
    if (user._id) {
      dispatch(getAccessLogById(user._id));
      dispatch(getPermissions({ id: user._id }))
        .unwrap()
        .then((response) => {
          if (response.permissions) {
            const permissionState = convertPermissionsToState(response.permissions);
            setPermissions(permissionState);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch permissions:', err);
          toast.error(err || 'Failed to fetch permissions');
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('singleUserLogRowsPerPage', logRowsPerPage.toString());
    }
  }, [logRowsPerPage]);

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

  const handleLogChangePage = (event: unknown, newPage: number) => {
    setLogPage(newPage);
  };

  const handleLogChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLogRowsPerPage(parseInt(event.target.value, 10));
    setLogPage(0);
  };

  const borderColor = theme.palette.divider;

  return (
    <BlankCard>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          bgcolor: primaryLight,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={800} fontSize={18}>
          View {user.name || 'User'}
        </Typography>
        <Link href={`/users/${user._id}/edit`} passHref>
            <Button variant="contained" color="primary" startIcon={<IconEdit />}>
              Edit {user.name}
            </Button>
          </Link>
          </Box>

      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* User Profile */}
          <Grid item xs={12} lg={12}>
            <BlankCard>
              <CardContent>
                <Box textAlign="center" display="flex" justifyContent="center">
                  <Box>
                    <Avatar
                      src={
                        user.profileImage
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profileImage}`
                          : ''
                      }
                      alt={user.name}
                      sx={{ width: 120, height: 120, margin: '0 auto' }}
                    />
                    <Typography variant="h6" mt={2}>
                      {user.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {user.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12}>
            <BlankCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  bgcolor: primaryLight,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Personal Details
                </Typography>
              </Box>
              <CardContent>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="name">
                        Full Name
                      </CustomFormLabel>
                      <CustomTextField
                        id="name"
                        value={user.name || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="email">
                        Email
                      </CustomFormLabel>
                      <CustomTextField
                        id="email"
                        value={user.email || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="phone">
                        Phone
                      </CustomFormLabel>
                      <CustomTextField
                        id="phone"
                        value={user.phone || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="role">
                        Role
                      </CustomFormLabel>
                      <CustomTextField
                        id="role"
                        value={user.role || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel sx={{ mt: 0 }} htmlFor="status">
                        Status
                      </CustomFormLabel>
                      <CustomTextField
                        id="status"
                        value={user.status || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomFormLabel htmlFor="two-factor-switch">
                        Enable 2FA
                      </CustomFormLabel>
                      <CustomSwitch
                        id="two-factor-switch"
                        checked={twoFactorEnabled}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </BlankCard>
          </Grid>

          {/* Roles and Permissions */}
          <Grid item xs={12}>
            <BlankCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  bgcolor: primaryLight,
                }}
              >
                <Typography variant="h6" fontWeight={600} fontSize={18}>
                  Roles and Permissions
                </Typography>
              </Box>
              <CardContent sx={{ pt: 0 }}>
                {permissionsLoading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <CustomFormLabel>Permissions</CustomFormLabel>
                      <TableContainer>
                        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1, px: 1 } }}>
                          <TableHead>
                            <TableRow sx={{ bgcolor: primaryLight }}>
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
                                {['View', 'Insert', 'Update', 'Delete'].map((permission) => {
                                  const mappedPermission =
                                    permission === 'View'
                                      ? 'view'
                                      : permission === 'Insert'
                                      ? 'create'
                                      : permission === 'Update'
                                      ? 'edit'
                                      : permission === 'Delete'
                                      ? 'delete'
                                      : permission.toLowerCase();
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
                                                permissions[module.name][mappedPermission] || false
                                              }
                                              disabled
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
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </BlankCard>
          </Grid>

          {/* Access Logs */}
          <Grid item xs={12}>
            <BlankCard>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  bgcolor: primaryLight,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Access Logs
                </Typography>
              </Box>
              <CardContent>
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 750, '& .MuiTableCell-root': { py: 1, px: 1 } }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: primaryLight, borderRadius: '8px' }}>
                        {activityLogHeadCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sx={{ typography: 'body2' }}
                          >
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                              {headCell.label}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accessLogsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <CircularProgress />
                            <Typography>Loading logs...</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        [...userAccessLogs]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(logPage * logRowsPerPage, logPage * logRowsPerPage + logRowsPerPage)
                          .map((log: any) => (
                            <AccessLogCollapsibleRow key={log._id} log={log} />
                          ))
                      )}
                      {userAccessLogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography>No access logs found for this user.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={userAccessLogs.length}
                  rowsPerPage={logRowsPerPage}
                  page={logPage}
                  onPageChange={handleLogChangePage}
                  onRowsPerPageChange={handleLogChangeRowsPerPage}
                />
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </Box>
    </BlankCard>
  );
};

export default SingleUser;


