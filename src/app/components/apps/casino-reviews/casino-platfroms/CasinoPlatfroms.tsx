'use client';
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCasinoPlatforms, createCasinoPlatform, updateCasinoPlatform, deleteCasinoPlatform } from '@/store/apps/casinoReview/CasinoPlatfromsSlice';
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
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket'; 
import { addPlatform, updatePlatformInList, removePlatformFromList } from '@/store/apps/casinoReview/CasinoPlatfromsSlice';


const headCells = [
  {
    id: 'platformName',
    numeric: false,
    disablePadding: false,
    label: 'PLATFORM NAME',
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
        placeholder="Search Platforms"
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
        Add New Platform
      </Button>
    </Box>
  );
};

const CasinoPlatforms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { platforms, isLoading, error } = useSelector((state: RootState) => state.casinoPlatforms);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [editingPlatform, setEditingPlatform] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchCasinoPlatforms());
  }, [dispatch]);
useEffect(() => {
    const handlePlatformCreated = (newPlatform: any) => dispatch(addPlatform(newPlatform));
    const handlePlatformUpdated = (updatedPlatform: any) => dispatch(updatePlatformInList(updatedPlatform));
    const handlePlatformDeleted = (platformId: string) => dispatch(removePlatformFromList(platformId));

    socket.on('platformCreated', handlePlatformCreated);
    socket.on('platformUpdated', handlePlatformUpdated);
    socket.on('platformDeleted', handlePlatformDeleted);
    return () => {
      socket.off('platformCreated', handlePlatformCreated);
      socket.off('platformUpdated', handlePlatformUpdated);
      socket.off('platformDeleted', handlePlatformDeleted);
    };
  }, [dispatch]);

  const handleCreate = async () => {
    if (newPlatformName.trim() === '') {
      return;
    }
    await dispatch(createCasinoPlatform(newPlatformName));
    setNewPlatformName('');
    setShowCreateForm(false);
    dispatch(fetchCasinoPlatforms());
  };

  const handleUpdate = async () => {
    if (editingPlatform && (typeof editingPlatform.name !== 'string' || editingPlatform.name.trim() === '')) {
      return;
    }
    if (editingPlatform) {
      await dispatch(updateCasinoPlatform({ id: editingPlatform._id, name: editingPlatform.name }));
      setEditingPlatform(null);
      dispatch(fetchCasinoPlatforms());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCasinoPlatform(id));
    dispatch(fetchCasinoPlatforms());
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

  const sortedPlatforms = [...platforms].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredPlatforms = sortedPlatforms.filter((platform: any) =>
    platform.name && platform.name.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPlatforms.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Platforms
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
                label="New Platform Name"
                variant="outlined"
                value={newPlatformName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlatformName(e.target.value)}
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
            <Typography>Loading Platforms...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="casino platforms table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredPlatforms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((platform: any) => (
                  <TableRow hover key={platform._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingPlatform && editingPlatform._id === platform._id ? (
                        <CustomTextField
                          value={editingPlatform.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingPlatform({ ...editingPlatform, name: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {platform.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {/* Assuming count is available in platform object, otherwise adjust */}
                        {platform.count ? platform.count : 'Not in use'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingPlatform && editingPlatform._id === platform._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingPlatform(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingPlatform({ ...platform })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(platform._id)} size="small">
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
          count={filteredPlatforms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoPlatforms;
