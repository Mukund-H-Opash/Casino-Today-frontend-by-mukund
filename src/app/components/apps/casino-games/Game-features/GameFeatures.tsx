'use client';
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchGameFeatures, createGameFeature, updateGameFeature, deleteGameFeature } from '@/store/apps/games/GameFeaturesSlice';
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
import { addGameFeature, updateGameFeatureInList, removeGameFeatureFromList } from '@/store/apps/games/GameFeaturesSlice';

const headCells = [
  {
    id: 'featureName',
    numeric: false,
    disablePadding: false,
    label: 'FEATURE NAME',
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
        placeholder="Search Features"
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
        Add New Feature
      </Button>
    </Box>
  );
};

const GameFeatures = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { features, isLoading, error } = useSelector((state: RootState) => state.gameFeatures);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchGameFeatures());
  }, [dispatch]);
  useEffect(() => {
    const handleGameFeatureCreated = (newGameFeature: any) => {
      dispatch(addGameFeature(newGameFeature));
    };
    const handleGameFeatureUpdated = (updatedGameFeature: any) => {
      dispatch(updateGameFeatureInList(updatedGameFeature));
    };
    const handleGameFeatureDeleted = (gameFeatureId: string) => {
      dispatch(removeGameFeatureFromList(gameFeatureId));
    };


    socket.on('gameFeatureCreated', handleGameFeatureCreated);
    socket.on('gameFeatureUpdated', handleGameFeatureUpdated);
    socket.on('gameFeatureDeleted', handleGameFeatureDeleted);

    return () => {
      socket.off('gameFeatureCreated', handleGameFeatureCreated);
      socket.off('gameFeatureUpdated', handleGameFeatureUpdated);
      socket.off('gameFeatureDeleted', handleGameFeatureDeleted);
    };
  }, [dispatch]);

  const handleCreate = async () => {
    if (newFeatureName.trim() === '') {
      return;
    }
    await dispatch(createGameFeature(newFeatureName));
    setNewFeatureName('');
    setShowCreateForm(false);
    dispatch(fetchGameFeatures());
  };

  const handleUpdate = async () => {
    if (editingFeature && (typeof editingFeature.gameFeatureName !== 'string' || editingFeature.gameFeatureName.trim() === '')) {
      return;
    }
    if (editingFeature) {
      await dispatch(updateGameFeature({ id: editingFeature._id, name: editingFeature.gameFeatureName }));
      setEditingFeature(null);
      dispatch(fetchGameFeatures());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteGameFeature(id));
    dispatch(fetchGameFeatures());
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

  const sortedFeatures = [...features].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredFeatures = sortedFeatures.filter((feature: any) =>
    feature.gameFeatureName && feature.gameFeatureName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredFeatures.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Game Features
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
                label="New Feature Name"
                variant="outlined"
                value={newFeatureName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFeatureName(e.target.value)}
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
            <Typography>Loading Features...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="game features table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredFeatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((feature: any) => (
                  <TableRow hover key={feature._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingFeature && editingFeature._id === feature._id ? (
                        <CustomTextField
                          value={editingFeature.gameFeatureName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingFeature({ ...editingFeature, gameFeatureName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {feature.gameFeatureName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {/* Assuming count is available in feature object, otherwise adjust */}
                        {feature.count ? feature.count : 'Not in use'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingFeature && editingFeature._id === feature._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingFeature(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingFeature({ ...feature })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(feature._id)} size="small">
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
          count={filteredFeatures.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default GameFeatures;
