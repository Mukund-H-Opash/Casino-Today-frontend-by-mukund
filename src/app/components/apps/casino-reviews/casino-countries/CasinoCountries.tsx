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
  fetchCasinoCountries,
  createCasinoCountry,
  updateCasinoCountry,
  deleteCasinoCountry,
} from '@/store/apps/casinoReview/CasinoCountriesSlice';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket';
import { addCountry, updateCountryInList, removeCountryFromList } from '@/store/apps/casinoReview/CasinoCountriesSlice';

const headCells = [
  {
    id: 'countryName',
    numeric: false,
    disablePadding: false,
    label: 'COUNTRY NAME',
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
        placeholder="Search Countries"
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
        Add New Country
      </Button>
    </Box>
  );
};

const CasinoCountries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries, isLoading } = useSelector((state: RootState) => state.casinoCountries);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchCasinoCountries());
  }, [dispatch]);

   useEffect(() => {
    const handleCountryCreated = (newCountry: any) => {
      dispatch(addCountry(newCountry));
    };
    const handleCountryUpdated = (updatedCountry: any) => {
      dispatch(updateCountryInList(updatedCountry));
    };
    const handleCountryDeleted = (countryId: string) => {
      dispatch(removeCountryFromList(countryId));
    };

    socket.on('countryCreated', handleCountryCreated);
    socket.on('countryUpdated', handleCountryUpdated);
    socket.on('countryDeleted', handleCountryDeleted);

    return () => {
      socket.off('countryCreated', handleCountryCreated);
      socket.off('countryUpdated', handleCountryUpdated);
      socket.off('countryDeleted', handleCountryDeleted);
    };
  }, [dispatch]);
  const handleCreate = async () => {
    if (newCountryName.trim() === '') {
      return;
    }
    await dispatch(createCasinoCountry(newCountryName));
    setNewCountryName('');
    setShowCreateForm(false);
    dispatch(fetchCasinoCountries());
  };

  const handleUpdate = async () => {
    if (editingCountry && (typeof editingCountry.countryName !== 'string' || editingCountry.countryName.trim() === '')) {
      return;
    }
    if (editingCountry) {
      await dispatch(updateCasinoCountry({ id: editingCountry._id, name: editingCountry.countryName }));
      setEditingCountry(null);
      dispatch(fetchCasinoCountries());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCasinoCountry(id));
    dispatch(fetchCasinoCountries());
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

  const sortedCountries = [...countries].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredCountries = sortedCountries.filter((country: any) =>
    country.countryName && country.countryName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCountries.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Countries
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
                label="New Country Name"
                variant="outlined"
                value={newCountryName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCountryName(e.target.value)}
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
            <Typography>Loading Countries...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="casino countries table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country: any) => (
                  <TableRow hover key={country._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingCountry && editingCountry._id === country._id ? (
                        <CustomTextField
                          value={editingCountry.countryName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingCountry({ ...editingCountry, countryName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {country.countryName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {country.count <1 ? 'Not in use' : country.count }
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingCountry && editingCountry._id === country._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingCountry(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingCountry({ ...country })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(country._id)} size="small">
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
          count={filteredCountries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoCountries;
