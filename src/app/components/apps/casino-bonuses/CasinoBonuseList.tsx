'use client';
import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import NextLink from 'next/link';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  TableHead,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import { Stack } from '@mui/system';
import BlankCard from '@/app/components/shared/BlankCard';
import { IconDots, IconEdit, IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchMyBonuses, deleteBonus, updateBonusStatus, clearBonus, Bonus } from '@/store/apps/bonuses/bonuseSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';
import socket from '@/utils/socket';
import { addBonus, updateBonusInList, removeBonusFromList } from '@/store/apps/bonuses/bonuseSlice';

const headCells: readonly {
  id: keyof Bonus | 'action';
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'NAME',
  },
  {
    id: 'casino',
    numeric: false,
    disablePadding: false,
    label: 'CASINO',
  },
  {
    id: 'bonusType',
    numeric: false,
    disablePadding: false,
    label: 'BONUS TYPE',
  },
  {
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: 'LAST UPDATE',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'STATUS',
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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleSearch, search } = props;

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
        placeholder="Search Bonus"
        size="small"
        onChange={handleSearch}
        value={search}
      />
      <Link href="/content/bonuses/create">
        <Button variant="contained" color="primary" startIcon={<IconPlus />}>
          Add New Bonus
        </Button>
      </Link>
    </Box>
  );
};

const CasinoBonusesList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedRowsPerPage = localStorage.getItem('casinoBonusesRowsPerPage');
      return storedRowsPerPage ? parseInt(storedRowsPerPage, 10) : 25;
    }
    return 5;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenu, setOpenedMenu] = useState<null | string>(null);
  const [search, setSearch] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { bonuses, isLoading, error } = useSelector((state: RootState) => state.bonus);
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  useEffect(() => {
    dispatch(fetchMyBonuses());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearBonus());
    };
  }, [dispatch]);

  useEffect(() => {
    // Handlers
    const handleBonusCreated = (newBonus: Bonus) => {
      dispatch(addBonus(newBonus));
    };
    const handleBonusUpdated = (updatedBonus: Bonus) => {
      dispatch(updateBonusInList(updatedBonus));
    };
    const handleBonusDeleted = (bonusId: string) => {
      dispatch(removeBonusFromList(bonusId));
    };

    // Listeners
    socket.on('bonusCreated', handleBonusCreated);
    socket.on('bonusUpdated', handleBonusUpdated);
    socket.on('bonusDeleted', handleBonusDeleted);

    // Cleanup
    return () => {
      socket.off('bonusCreated', handleBonusCreated);
      socket.off('bonusUpdated', handleBonusUpdated);
      socket.off('bonusDeleted', handleBonusDeleted);
    };
  }, [dispatch]);

  // Handle search
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    setPage(0);
  };

  const filteredBonuses = bonuses.filter((bonus) =>
    (bonus.name?.toLowerCase() || '').includes(search) ||
    (bonus.casino?.name?.toLowerCase() || '').includes(search) ||
    (bonus.bonusType?.name?.toLowerCase() || '').includes(search)
  );


  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('casinoBonusesRowsPerPage', newRowsPerPage.toString());
    }
  };

  // Handle menu actions
  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenu(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedMenu(null);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    dispatch(updateBonusStatus({ bonusId: id, newStatus })).then((result) => {
      if (updateBonusStatus.fulfilled.match(result)) {
        dispatch(fetchMyBonuses());
      } else if (updateBonusStatus.rejected.match(result)) {
        toast.error('Failed to update bonus status');
      }
    });
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBonus(id)).then((result) => {
      if (deleteBonus.rejected.match(result)) {
        toast.error('Failed to delete bonus');
      }
    });
    handleClose();
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredBonuses.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Bonuses
        </Typography>
      </Box>
      <EnhancedTableToolbar search={search} handleSearch={handleSearch} />
      <Box sx={{ width: '100%', p: 2 }}>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress />
            <Typography>Loading...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', minWidth: 750 }}>
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
                {[...filteredBonuses]
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())

                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: Bonus) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">
                          {row.casino?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.bonusType?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">
                          {new Date(row.updatedAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          }).replace(/\//g, '-')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          sx={{
                            backgroundColor:
                              row.status === 'enabled' ?
                                theme.palette.success.light : theme.palette.error.light,
                            color: row.status === 'enabled' ?
                              theme.palette.success.main : theme.palette.error.main,
                          }}
                          size="small"
                          onClick={() => handleToggleStatus(row._id, row.status)}
                        />
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
                          <NextLink href={`/content/bonuses/${row._id}`} passHref>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IconPlus width={18} />
                              </ListItemIcon>
                              View
                            </MenuItem>
                          </NextLink>
                          <NextLink href={`/content/bonuses/${row._id}/edit`} passHref>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IconEdit width={18} />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                          </NextLink>
                          <MenuItem onClick={() => handleDelete(row._id)} sx={{ color: 'error.main' }}>
                            <ListItemIcon>
                              <IconTrash width={18} />
                            </ListItemIcon>
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBonuses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoBonusesList;