'use client';
import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import { getAccessLogs } from '@/store/apps/accesslogs/accesslogSlice';
import { AppDispatch, RootState } from '@/store/store';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Chip,
  Stack,
  CardContent,
  TablePagination,
  IconButton,
  Menu,
  useTheme,
  CircularProgress,
  ListItemIcon,
  Theme,
  TableBody,
  Collapse,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import theme from '@/utils/theme';

const activityTypes = ['update', 'create', 'delete', 'login'];

const activityLogHeadCells = [
    { id: 'expand', numeric: false, disablePadding: false, label: '' },
    { id: 'username', numeric: false, disablePadding: false, label: 'USER' },
    { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
    { id: 'details', numeric: false, disablePadding: false, label: 'DETAILS' },
    { id: 'date', numeric: false, disablePadding: false, label: 'DATE' },
  ];

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

const RecentUpdatesTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const { accessLogs, loading: accessLogsLoading } = useSelector((state: RootState) => state.accesslogs);
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const [filterActivityType, setFilterActivityType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLogRowsPerPage = localStorage.getItem('activityLogRowsPerPage');
      return storedLogRowsPerPage ? parseInt(storedLogRowsPerPage, 10) : 25;
    }
    return 5;
  });

  useEffect(() => {
    dispatch(getAccessLogs());
  }, [dispatch]);

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

  const filteredLogs = Array.isArray(accessLogs) ? accessLogs.filter(
    (log) => {
      const logDate = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : '';
      const matchesActivityType = filterActivityType === '' || log.action === filterActivityType;
      const matchesDate = filterDate === '' || logDate === filterDate;
      return matchesActivityType && matchesDate;
    }
  ) : [];

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>Recent Updates</Typography>
      </Box>
      <CardContent>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="filterActivityType">Filter by Activity Type</CustomFormLabel>
            <CustomSelect
              fullWidth
              id="filterActivityType"
              name="filterActivityType"
              value={filterActivityType}
              onChange={(e: ChangeEvent<{ value: unknown }>) => setFilterActivityType(e.target.value as string)}
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
              value={filterDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterDate(e.target.value)}
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
              {filteredLogs.length === 0 && !accessLogsLoading && (
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
  );
};

export default RecentUpdatesTable;
