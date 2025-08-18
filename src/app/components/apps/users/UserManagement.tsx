'use client';
import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '@/store/hooks';
import { fetchUsers } from '@/store/apps/users/userSlice';
import { getAccessLogs } from '@/store/apps/accesslogs/accesslogSlice';
import { AppDispatch, RootState } from '@/store/store';
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Chip,
  Stack,
  CardContent,
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
  Menu,
  useTheme,
  CircularProgress,
  ListItemIcon,
  Theme,
  TableBody,
  Collapse,
} from '@mui/material';
import {
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
  IconSearch,
} from '@tabler/icons-react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import Link from 'next/link';
import { User } from '@/store/apps/users/userSlice';
import socket from '@/utils/socket';
import { addUsers, updateUserInList, removeUserFromList } from '@/store/apps/users/userSlice';

interface UserManagementState {
  searchQuery: string;
  filterRole: string;
  filterActivityType: string;
  filterDate: string;
}

const roles = ['admin', 'editor', 'subadmin', 'manager'];
const activityTypes = ['update', 'create', 'delete', 'login'];

const initialState: UserManagementState = {
  searchQuery: '',
  filterRole: '',
  filterActivityType: '',
  filterDate: '',
};

const headCells = [
  { id: 'username', numeric: false, disablePadding: false, label: 'USERNAME' },
  { id: 'name', numeric: false, disablePadding: false, label: 'NAME' },
  { id: 'email', numeric: false, disablePadding: false, label: 'EMAIL' },
  { id: 'role', numeric: false, disablePadding: false, label: 'ROLE' },
  { id: 'status', numeric: false, disablePadding: false, label: 'STATUS' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'CREATION DATE' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
];

const activityLogHeadCells = [
  { id: 'expand', numeric: false, disablePadding: false, label: '' },
  { id: 'username', numeric: false, disablePadding: false, label: 'USER' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
  { id: 'details', numeric: false, disablePadding: false, label: 'DETAILS' },
  { id: 'date', numeric: false, disablePadding: false, label: 'DATE' },
];

interface EnhancedTableToolbarProps {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  filterRole: string;
  handleFilterRole: (event: ChangeEvent<{ value: unknown }>) => void;
  theme: Theme;
}

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

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleSearch, search, filterRole, handleFilterRole, theme } = props;

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <CustomFormLabel htmlFor="search-input">Search Users</CustomFormLabel>
          <CustomTextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ paddingTop: 3, paddingBottom: 3 }}>
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search by username, name, or email"
            size="small"
            onChange={handleSearch}
            value={search}
            fullWidth
            id="search-input"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomFormLabel htmlFor="filterRole">Filter by Role</CustomFormLabel>
          <CustomSelect
            fullWidth
            id="filterRole"
            name="filterRole"
            value={filterRole}
            onChange={handleFilterRole}
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </CustomSelect>
        </Grid>
        <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="flex-end">
          <NextLink href="/users/create" passHref>
            <Button variant="contained" color="primary" startIcon={<IconPlus width={20} height={20} />}>
              Create User
            </Button>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
};

const UserManagement = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { users, isLoading: usersLoading } = useSelector((state: RootState) => state.user);
  const { accessLogs, loading: accessLogsLoading } = useSelector((state: RootState) => state.accesslogs);
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const [state, setState] = useState<UserManagementState>(initialState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedRowsPerPage = localStorage.getItem('userManagementRowsPerPage');
      return storedRowsPerPage ? parseInt(storedRowsPerPage, 10) : 25;
    }
    return 5;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenu, setOpenedMenu] = useState<null | string>(null);
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLogRowsPerPage = localStorage.getItem('activityLogRowsPerPage');
      return storedLogRowsPerPage ? parseInt(storedLogRowsPerPage, 10) : 25;
    }
    return 5;
  });
  const [rows, setRows] = useState<User[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(getAccessLogs());
  }, [dispatch]);

   useEffect(() => {

    const handleUsersCreated = (newUsers: User[]) => {
      dispatch(addUsers(newUsers));
    };
    const handleUserUpdated = (updatedUser: User) => {
      dispatch(updateUserInList(updatedUser));
    };
    const handleUserDeleted = (userId: string) => {
      dispatch(removeUserFromList(userId));
    };

    socket.on('usersCreated', handleUsersCreated);
    socket.on('userUpdated', handleUserUpdated);
    socket.on('userDeleted', handleUserDeleted);

    return () => {
      socket.off('usersCreated', handleUsersCreated);
      socket.off('userUpdated', handleUserUpdated);
      socket.off('userDeleted', handleUserDeleted);
    };
  }, [dispatch]);

  useEffect(() => {
    setRows(users);
  }, [users]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setState((prevState) => ({ ...prevState, searchQuery }));
    const filteredRows = users.filter((user: User) =>
      (searchQuery === '' ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (state.filterRole === '' || user.role === state.filterRole)
    );
    setRows(filteredRows);
    setPage(0);
  };

  const handleFilterRole = (event: ChangeEvent<{ value: unknown }>) => {
    const filterRole = event.target.value as string;
    setState((prevState) => ({ ...prevState, filterRole }));
    const filteredRows = users.filter((user: User) =>
      (state.searchQuery === '' ||
        (user.username && user.username.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
        user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchQuery.toLowerCase())) &&
      (filterRole === '' || user.role === filterRole)
    );
    setRows(filteredRows);
    setPage(0);
  };

  const toggleStatus = (id: string) => {
    handleClose();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenu(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedMenu(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userManagementRowsPerPage', newRowsPerPage.toString());
    }
  };

  const handleLogChangePage = (event: unknown, newPage: number) => {
    setLogPage(newPage);
  };

  const handleLogChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newLogRowsPerPage = parseInt(event.target.value, 10);
    setLogRowsPerPage(newLogRowsPerPage);
    setLogPage(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activityLogRowsPerPage', newLogRowsPerPage.toString());
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredLogs = Array.isArray(accessLogs) ? accessLogs.filter(
    (log) => {
      const logDate = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : '';
      const matchesActivityType = state.filterActivityType === '' || log.action === state.filterActivityType;
      const matchesDate = state.filterDate === '' || logDate === state.filterDate;
      return matchesActivityType && matchesDate;
    }
  ) : [];

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={800} fontSize={18}>
          User Management
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* User Directory */}
          <Grid item xs={12}>
            <BlankCard>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
                <Typography variant="h6" fontWeight={600}>
                  User Directory
                </Typography>
              </Box>
              <CardContent sx={{ pt: 0 }}>
                <EnhancedTableToolbar
                  search={state.searchQuery}
                  handleSearch={handleSearch}
                  filterRole={state.filterRole}
                  handleFilterRole={handleFilterRole}
                  theme={theme}
                />
                {usersLoading ? (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <CircularProgress />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table sx={{ whiteSpace: 'nowrap', minWidth: 750 }} aria-label="simple table">
                      <TableHead>
                        <TableRow sx={{ bgcolor: primaryLight, borderRadius: '8px' }}>
                          {headCells.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              align={headCell.numeric ? 'right' : 'left'}
                              padding={headCell.disablePadding ? 'none' : 'normal'}
                            >
                              <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {headCell.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...rows]
                          .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row: User) => (
                            <TableRow role="checkbox" tabIndex={-1} key={row._id}>
                              <TableCell>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {row.username}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.role}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  sx={{
                                    backgroundColor: () => {
                                      switch (row.status) {
                                        case 'active':
                                          return theme.palette.primary.light;
                                        case 'inactive':
                                          return theme.palette.warning.light;
                                        case 'blocked':
                                          return theme.palette.error.light;
                                        case 'pending':
                                          return theme.palette.secondary.light;
                                        default:
                                          return theme.palette.grey[300];
                                      }
                                    },
                                    color: () => {
                                      switch (row.status) {
                                        case 'active':
                                          return theme.palette.primary.main;
                                        case 'inactive':
                                          return theme.palette.warning.main;
                                        case 'blocked':
                                          return theme.palette.error.main;
                                        case 'pending':
                                          return theme.palette.secondary.main;
                                        default:
                                          return theme.palette.grey[700];
                                      }
                                    },
                                  }}
                                  size="small"
                                  onClick={() => toggleStatus(row._id)}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.createdAt
                                    ? new Date(row.createdAt).toLocaleString('en-GB', {
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
                              <TableCell>
                                <IconButton
                                  id={`action-button-${row._id}`}
                                  aria-controls={openedMenu === row._id ? `action-menu-${row._id}` : undefined}
                                  aria-haspopup="true"
                                  aria-expanded={openedMenu === row._id ? 'true' : undefined}
                                  onClick={(event) => handleClick(event, row._id)}
                                >
                                  <IconDots width={18} />
                                </IconButton>
                                <Menu
                                  id={`action-menu-${row._id}`}
                                  anchorEl={anchorEl}
                                  open={openedMenu === row._id}
                                  onClose={handleClose}
                                  elevation={0}
                                  MenuListProps={{
                                    'aria-labelledby': `action-button-${row._id}`,
                                  }}
                                >
                                  <NextLink href={`/users/${row._id}`} passHref>
                                    <MenuItem onClick={handleClose}>
                                      <ListItemIcon>
                                        <IconPlus width={18} />
                                      </ListItemIcon>
                                      View
                                    </MenuItem>
                                  </NextLink>
                                  <NextLink href={`/users/${row._id}/edit`} passHref>
                                    <MenuItem onClick={handleClose}>
                                      <ListItemIcon>
                                        <IconEdit width={18} />
                                      </ListItemIcon>
                                      Edit
                                    </MenuItem>
                                  </NextLink>
                                  {/* <MenuItem sx={{ color: 'error.main' }}>
                                    <ListItemIcon>
                                      <IconTrash width={18} />
                                    </ListItemIcon>
                                    Delete
                                  </MenuItem> */}
                                </Menu>
                              </TableCell>
                            </TableRow>
                          ))}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={7} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </BlankCard>
          </Grid>

          {/* Activity Logs */}
          <Grid item xs={12}>
            <BlankCard>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
                <Typography variant="h6" fontWeight={600}>
                  Activity Logs
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="filterActivityType">Filter by Activity Type</CustomFormLabel>
                    <CustomSelect
                      fullWidth
                      id="filterActivityType"
                      name="filterActivityType"
                      value={state.filterActivityType}
                      onChange={(e: ChangeEvent<{ value: unknown }>) => setState({ ...state, filterActivityType: e.target.value as string })}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {activityTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="filterDate">Filter by Date</CustomFormLabel>
                    <CustomTextField
                      id="filterDate"
                      name="filterDate"
                      type="date"
                      value={state.filterDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setState({ ...state, filterDate: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <TableContainer>
                  <Table sx={{ whiteSpace: 'nowrap', minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                      <TableRow sx={{ bgcolor: primaryLight, borderRadius: '8px' }}>
                        {activityLogHeadCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
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
                        filteredLogs
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(logPage * logRowsPerPage, logPage * logRowsPerPage + logRowsPerPage)
                          .map((log) => (
                            <AccessLogCollapsibleRow key={log._id} log={log} />
                          ))
                      )}
                      {filteredLogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography>No activity logs found.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredLogs.length}
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

export default UserManagement;
