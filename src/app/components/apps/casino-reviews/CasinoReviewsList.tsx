'use client';
import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import NextLink from 'next/link';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
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
import { fetchMyCasinos, deleteCasino, updateCasinoStatus, CasinoReview } from '@/store/apps/casinoReview/casinoSlice';
import socket from '@/utils/socket';
import { addCasino, updateCasinoInList, removeCasinoFromList } from '@/store/apps/casinoReview/casinoSlice'; 
import Link from 'next/link';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'NAME',
  },
  {
    id: 'slug',
    numeric: false,
    disablePadding: false,
    label: 'SLUG',
  },
  {
    id: 'featuredLogo',
    numeric: false,
    disablePadding: false,
    label: 'FEATURED LOGO',
  },
  {
    id: 'rating',
    numeric: false,
    disablePadding: false,
    label: 'RATING',
  },
  {
    id: 'tags',
    numeric: false,
    disablePadding: false,
    label: 'TAGS',
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
        placeholder="Search Casino"
        size="small"
        onChange={handleSearch}
        value={search}
      />
      <Link href="/content/casino-reviews/create">
        <Button variant="contained" color="primary" startIcon={<IconPlus />}>
          Add New Review
        </Button>
      </Link>
    </Box>
  );
};

const CasinoReviewsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedRowsPerPage = localStorage.getItem('casinoReviewsRowsPerPage');
      return storedRowsPerPage ? parseInt(storedRowsPerPage, 10) : 25;
    }
    return 5;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenu, setOpenedMenu] = useState<null | string>(null);
  const [search, setSearch] = useState('');

  // Redux integration
  const dispatch: AppDispatch = useDispatch();
  const { casinos, isLoading } = useSelector((state: RootState) => state.casinos);
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  // Fetch casino data on mount
  useEffect(() => {
    dispatch(fetchMyCasinos());
  }, [dispatch]);

  useEffect(() => {
    // Handlers
    const handleCasinoCreated = (newCasino: any) => {
      dispatch(addCasino(newCasino));
    };
    const handleCasinoUpdated = (updatedCasino: any) => {
      dispatch(updateCasinoInList(updatedCasino));
    };
    const handleCasinoDeleted = (casinoId: any) => {
      dispatch(removeCasinoFromList(casinoId));
    };

    // Listeners
    socket.on('casinoCreated', handleCasinoCreated);
    socket.on('casinoUpdated', handleCasinoUpdated);
    socket.on('casinoDeleted', handleCasinoDeleted);

    // Cleanup
    return () => {
      socket.off('casinoCreated', handleCasinoCreated);
      socket.off('casinoUpdated', handleCasinoUpdated);
      socket.off('casinoDeleted', handleCasinoDeleted);
    };
  }, [dispatch]);

  const filteredCasinos = (casinos || []).filter((casino) => casino.name.toLowerCase().includes(search.toLowerCase()));

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
      localStorage.setItem('casinoReviewsRowsPerPage', newRowsPerPage.toString());
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDelete = (id: string) => {
    handleClose();
    dispatch(deleteCasino(id));
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    await dispatch(updateCasinoStatus({ casinoId: id, newStatus }));
    dispatch(fetchMyCasinos());
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCasinos.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Reviews
        </Typography>
      </Box>
      <EnhancedTableToolbar search={search} handleSearch={handleSearch} />
      <Box sx={{ width: '100%', p: 2 }}>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress />
            <Typography>Loading Your Casinos...</Typography>
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
                {[...filteredCasinos]
                  
                  .sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
                    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
                    return dateB - dateA;
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: CasinoReview) => (
                    <TableRow hover key={row._id}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">
                          {row.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${row.featuredLogo}`}
                          alt={row.name}
                          variant="rounded"
                          sx={{ width: 42, height: 42 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.rating}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {(row.tags || []).map((tag, i) => {
                            const colors = ['primary.main', 'secondary.main', 'error.main', 'success.main', 'warning.main'];
                            const color = colors[i % colors.length];
                            return (
                              <Chip
                                label={tag.name}
                                sx={{
                                  backgroundColor: color,
                                  color: 'white',
                                  fontSize: '11px',
                                }}
                                key={i}
                                size="small"
                              />
                            );
                          })}
                        </Stack>
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
                          onClick={() => handleStatusToggle(row._id, row.status)}
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
                          <NextLink href={`/content/casino-reviews/${row._id}`} passHref>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IconPlus width={18} />
                              </ListItemIcon>
                              View
                            </MenuItem>
                          </NextLink>
                          <NextLink href={`/content/casino-reviews/${row._id}/edit`} passHref>
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
          count={filteredCasinos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoReviewsList;