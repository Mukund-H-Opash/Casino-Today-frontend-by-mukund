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
  fetchBonusTypes,
  createBonusType,
  updateBonusType,
  deleteBonusType,
} from '@/store/apps/bonuses/BonusTypesSlice';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket';
import { addBonusType, updateBonusTypeInList, removeBonusTypeFromList } from '@/store/apps/bonuses/BonusTypesSlice';

const headCells = [
  {
    id: 'bonusTypeName',
    numeric: false,
    disablePadding: false,
    label: 'TYPE NAME',
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
        placeholder="Search Types"
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
        Add New Type
      </Button>
    </Box>
  );
};

const BonusTypes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { types, isLoading } = useSelector((state: RootState) => state.bonusTypes);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingType, setEditingType] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchBonusTypes());
  }, [dispatch]);

  useEffect(() => {
    const handleBonusTypeCreated = (newType: any) => {
      dispatch(addBonusType(newType));
    };
    const handleBonusTypeUpdated = (updatedType: any) => {
      dispatch(updateBonusTypeInList(updatedType));
    };
    const handleBonusTypeDeleted = (type: any) => {
      dispatch(removeBonusTypeFromList(type._id));
    };

    socket.on('bonusTypeCreated', handleBonusTypeCreated);
    socket.on('bonusTypeUpdated', handleBonusTypeUpdated);
    socket.on('bonusTypeDeleted', handleBonusTypeDeleted);

    return () => {
      socket.off('bonusTypeCreated', handleBonusTypeCreated);
      socket.off('bonusTypeUpdated', handleBonusTypeUpdated);
      socket.off('bonusTypeDeleted', handleBonusTypeDeleted);
    };
  }, [dispatch]);

  const handleCreate = async () => {
    if (newTypeName.trim() === '') {
      return;
    }
    await dispatch(createBonusType(newTypeName));
    setNewTypeName('');
    setShowCreateForm(false);
    dispatch(fetchBonusTypes());
  };

  const handleUpdate = async () => {
    if (editingType && (typeof editingType.bonusTypeName !== 'string' || editingType.bonusTypeName.trim() === '')) {
      return;
    }
    if (editingType) {
      await dispatch(updateBonusType({ id: editingType._id, name: editingType.bonusTypeName }));
      setEditingType(null);
      dispatch(fetchBonusTypes());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteBonusType(id));
    dispatch(fetchBonusTypes());
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
    const sortedTypes = [...types].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredTypes = sortedTypes.filter((type: any) =>
    type.bonusTypeName && type.bonusTypeName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTypes.length) : 0;

  return (  
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Bonus Types
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
                label="New Type Name"
                variant="outlined"
                value={newTypeName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTypeName(e.target.value)}
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
            <Typography>Loading Types...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="bonus types table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredTypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((type: any) => (
                  <TableRow hover key={type._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingType && editingType._id === type._id ? (
                        <CustomTextField
                          value={editingType.bonusTypeName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingType({ ...editingType, bonusTypeName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {type.bonusTypeName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {type.count <1 ? 'Not in use' : type.count}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingType && editingType._id === type._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingType(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingType({ ...type })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(type._id)} size="small">
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
          count={filteredTypes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default BonusTypes;
