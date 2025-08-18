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
  fetchBonusTags,
  createBonusTag,
  updateBonusTag,
  deleteBonusTag,
} from '@/store/apps/bonuses/BonusTagsSlice';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import socket from '@/utils/socket';
import { addBonusTag, updateBonusTagInList, removeBonusTagFromList } from '@/store/apps/bonuses/BonusTagsSlice';

const headCells = [
  {
    id: 'bonusTagName',
    numeric: false,
    disablePadding: false,
    label: 'TAG NAME',
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
        placeholder="Search Tags"
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
        Add New Tag
      </Button>
    </Box>
  );
};

const BonusTags = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags, isLoading } = useSelector((state: RootState) => state.bonusTags);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;

  useEffect(() => {
    dispatch(fetchBonusTags());
  }, [dispatch]);

 useEffect(() => {
    const handleBonusTagCreated = (newTag: any) => {
      dispatch(addBonusTag(newTag));
    };
    const handleBonusTagUpdated = (updatedTag: any) => {
      dispatch(updateBonusTagInList(updatedTag));
    };
    const handleBonusTagDeleted = (tag: any) => {
      dispatch(removeBonusTagFromList(tag._id));
    };

    socket.on('bonusTagCreated', handleBonusTagCreated);
    socket.on('bonusTagUpdated', handleBonusTagUpdated);
    socket.on('bonusTagDeleted', handleBonusTagDeleted);

    return () => {
      socket.off('bonusTagCreated', handleBonusTagCreated);
      socket.off('bonusTagUpdated', handleBonusTagUpdated);
      socket.off('bonusTagDeleted', handleBonusTagDeleted);
    };
  }, [dispatch]);
  const handleCreate = async () => {
    if (newTagName.trim() === '') {
      return;
    }
    await dispatch(createBonusTag(newTagName));
    setNewTagName('');
    setShowCreateForm(false);
    dispatch(fetchBonusTags());
  };

  const handleUpdate = async () => {
    if (editingTag && (typeof editingTag.bonusTagName !== 'string' || editingTag.bonusTagName.trim() === '')) {
      return;
    }
    if (editingTag) {
      await dispatch(updateBonusTag({ id: editingTag._id, name: editingTag.bonusTagName }));
      setEditingTag(null);
      dispatch(fetchBonusTags());
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteBonusTag(id));
    dispatch(fetchBonusTags());
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
 const sortedTags = [...tags].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const filteredTags = sortedTags.filter((tag: any) =>
    tag.bonusTagName && tag.bonusTagName.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTags.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Bonus Tags
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
                label="New Tag Name"
                variant="outlined"
                value={newTagName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTagName(e.target.value)}
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
            <Typography>Loading Tags...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="bonus tags table" sx={{ whiteSpace: 'nowrap' }}>
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
                {filteredTags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tag: any) => (
                  <TableRow hover key={tag._id}>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingTag && editingTag._id === tag._id ? (
                        <CustomTextField
                          value={editingTag.bonusTagName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingTag({ ...editingTag, bonusTagName: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {tag.bonusTagName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {tag.count <1 ? 'Not in use' : tag.count}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 2 }}>
                      {editingTag && editingTag._id === tag._id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" color="primary" onClick={handleUpdate} size="small">Save</Button>
                          <Button variant="outlined" color="error" onClick={() => setEditingTag(null)} size="small">Cancel</Button>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton onClick={() => setEditingTag({ ...tag })} size="small">
                            <IconEdit width={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(tag._id)} size="small">
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
          count={filteredTags.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default BonusTags;
