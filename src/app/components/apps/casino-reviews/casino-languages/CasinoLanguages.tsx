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
  fetchCasinoLanguages,
  createCasinoLanguage,
  updateCasinoLanguage,
  deleteCasinoLanguage,
} from '@/store/apps/casinoReview/CasinoLanguagesSlice';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket';
import { addLanguage, updateLanguageInList, removeLanguageFromList } from '@/store/apps/casinoReview/CasinoLanguagesSlice';

const headCells = [
  {
    id: 'languageName',
    numeric: false,
    disablePadding: false,
    label: 'LANGUAGE NAME',
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
        placeholder="Search Languages"
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
        Add New Language
      </Button>
    </Box>
  );
};

const CasinoLanguages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { languages, isLoading } = useSelector((state: RootState) => state.casinoLanguages);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState('');
  const [editingLanguage, setEditingLanguage] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchCasinoLanguages());
  }, [dispatch]);
  useEffect(() => {
    const handleLanguageCreated = (newLanguage: any) => {
      dispatch(addLanguage(newLanguage));
    };
    const handleLanguageUpdated = (updatedLanguage: any) => {
     
      dispatch(updateLanguageInList(updatedLanguage));
    };
    const handleLanguageDeleted = (languageId: string) => {
      
      dispatch(removeLanguageFromList(languageId));
    };
    socket.on('languageCreated', handleLanguageCreated);
    socket.on('languageUpdated', handleLanguageUpdated);
    socket.on('languageDeleted', handleLanguageDeleted);
    return () => {
      socket.off('languageCreated', handleLanguageCreated);
      socket.off('languageUpdated', handleLanguageUpdated);
      socket.off('languageDeleted', handleLanguageDeleted);
    };
  }, [dispatch]);

  const handleCreate = async () => {
    if (newLanguageName.trim() === '') {
      return;
    }
    await dispatch(createCasinoLanguage(newLanguageName));
    setNewLanguageName('');
    setShowCreateForm(false);
    dispatch(fetchCasinoLanguages());
  };

  const handleUpdate = async () => {
    if (editingLanguage && (typeof editingLanguage.languageName !== 'string' || editingLanguage.languageName.trim() === '')) {
      return;
    }
    if (editingLanguage) {
      await dispatch(updateCasinoLanguage({ id: editingLanguage._id, name: editingLanguage.languageName }));
      setEditingLanguage(null);
      dispatch(fetchCasinoLanguages());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCasinoLanguage(id));
    dispatch(fetchCasinoLanguages());
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

  const sortedLanguages = [...languages].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredLanguages = sortedLanguages.filter((language: any) =>
    language.languageName && language.languageName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredLanguages.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Languages
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
                label="New Language Name"
                variant="outlined"
                value={newLanguageName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewLanguageName(e.target.value)}
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
            <Typography>Loading Languages...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="casino languages table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredLanguages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((language: any) => (
                  <TableRow hover key={language._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingLanguage && editingLanguage._id === language._id ? (
                        <CustomTextField
                          value={editingLanguage.languageName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingLanguage({ ...editingLanguage, languageName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {language.languageName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {language.count <1? 'Not in use' : language.count}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingLanguage && editingLanguage._id === language._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingLanguage(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingLanguage({ ...language })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(language._id)} size="small">
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
          count={filteredLanguages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoLanguages;
