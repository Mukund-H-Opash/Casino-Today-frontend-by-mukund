'use client';
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  TableContainer,
  Paper,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchSoftwareProviders,
  createSoftwareProvider,
  updateSoftwareProvider,
  deleteSoftwareProvider,
} from '@/store/apps/games/SoftwareProvidersSlice';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket';
import { addSoftwareProvider, updateSoftwareProviderInList, removeSoftwareProviderFromList } from '@/store/apps/games/SoftwareProvidersSlice';

const headCells = [
  {
    id: 'providerName',
    numeric: false,
    disablePadding: false,
    label: 'PROVIDER NAME',
  },
  {
    id: 'count',
    numeric: false,
    disablePadding: false,
    label: 'NUMBER OF USES',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'ACTION',
  },
];

interface EnhancedTableToolbarProps {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateForm: boolean;
}

const EnhancedTableToolbar = ({ handleSearch, search, setShowCreateForm, showCreateForm }: EnhancedTableToolbarProps) => {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size="1.1rem" />
            </InputAdornment>
          ),
        }}
        placeholder="Search Providers"
        size="small"
        onChange={handleSearch}
        value={search}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<IconPlus />}
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        Add New Provider
      </Button>
    </Box>
  );
};

const SoftwareProviders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { providers, isLoading } = useSelector((state: RootState) => state.softwareProviders);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchSoftwareProviders());
  }, [dispatch]);
  useEffect(() => {
    
    const handleProviderCreated = (newProvider: any) => {
      dispatch(addSoftwareProvider(newProvider));
    };
    const handleProviderUpdated = (updatedProvider: any) => {
      dispatch(updateSoftwareProviderInList(updatedProvider));
    };
    const handleProviderDeleted = (providerId: string) => {
      dispatch(removeSoftwareProviderFromList(providerId));
    };


    socket.on('softwareProviderCreated', handleProviderCreated);
    socket.on('softwareProviderUpdated', handleProviderUpdated);
    socket.on('softwareProviderDeleted', handleProviderDeleted);

    return () => {
      socket.off('softwareProviderCreated', handleProviderCreated);
      socket.off('softwareProviderUpdated', handleProviderUpdated);
      socket.off('softwareProviderDeleted', handleProviderDeleted);
    };
  }, [dispatch]);

  const handleCreate = async () => {
    if (newProviderName.trim() === '') {
      return;
    }
    await dispatch(createSoftwareProvider(newProviderName));
    setNewProviderName('');
    setShowCreateForm(false);
    dispatch(fetchSoftwareProviders());
  };

  const handleUpdate = async () => {
    if (editingProvider && (typeof editingProvider.providerName !== 'string' || editingProvider.providerName.trim() === '')) {
      return;
    }
    if (editingProvider) {
      await dispatch(updateSoftwareProvider({ id: editingProvider._id, name: editingProvider.providerName }));
      setEditingProvider(null);
      dispatch(fetchSoftwareProviders());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteSoftwareProvider(id));
    dispatch(fetchSoftwareProviders());
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedProviders = [...providers].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredProviders = sortedProviders.filter((provider: any) =>
    provider.providerName && provider.providerName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredProviders.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Software Providers
        </Typography>
      </Box>
      <EnhancedTableToolbar
        search={search}
        handleSearch={handleSearch}
        setShowCreateForm={setShowCreateForm}
        showCreateForm={showCreateForm}
      />
      <Box sx={{ p: 2 }}>
        <Collapse in={showCreateForm}>
          <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
            <Box sx={{ p: 3 }}>
              <CustomTextField
                label="New Provider Name"
                variant="outlined"
                value={newProviderName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProviderName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleCreate}>Save</Button>
                <Button variant="outlined" color="error" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress />
            <Typography>Loading Providers...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="software providers table" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: primaryLight, borderRadius: '8px' }}>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? 'right' : 'left'}
                      padding="normal"
                    >
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {headCell.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProviders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((provider: any) => (
                  <TableRow hover key={provider._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingProvider && editingProvider._id === provider._id ? (
                        <CustomTextField
                          value={editingProvider.providerName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProvider({ ...editingProvider, providerName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {provider.providerName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {provider.count  <1 ? 'Not in use' : provider.count}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingProvider && editingProvider._id === provider._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingProvider(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingProvider({ ...provider })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(provider._id)} size="small">
                            <IconTrash width={18} />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProviders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default SoftwareProviders;
