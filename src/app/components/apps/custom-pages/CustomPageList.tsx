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
import BlankCard from '@/app/components/shared/BlankCard';
import { IconDots, IconEdit, IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import {
  CustomPage,
  fetchMyCustomPages,
  updateCustomPage,
  deleteCustomPage,
  clearCustomPage,
  updateCustompageStatus,
} from '@/store/apps/custom-pages/CustomPageSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';
import socket from '@/utils/socket';
import { addCustomPage, updateCustomPageInList, removeCustomPageFromList } from '@/store/apps/custom-pages/CustomPageSlice';


const headCells: { id: keyof CustomPage | 'action'; numeric: boolean; disablePadding: boolean; label: string }[] = [
  { id: 'title', numeric: false, disablePadding: false, label: 'TITLE' },
  { id: 'slug', numeric: false, disablePadding: false, label: 'SLUG' },
  { id: 'author', numeric: false, disablePadding: false, label: 'AUTHOR' },
  { id: 'status', numeric: false, disablePadding: false, label: 'STATUS' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
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
        placeholder="Search Custom Page"
        size="small"
        onChange={handleSearch}
        value={search}
      />
      <Link href="/content/custom-pages/create">
        <Button variant="contained" color="primary" startIcon={<IconPlus />}>
          Add New Custom Page
        </Button>
      </Link>
    </Box>
  )
};

const CasinoCustomPagesList= () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pages, isLoading, error } = useSelector((state: RootState) => state.customPages);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedRowsPerPage = localStorage.getItem('customPagesRowsPerPage');
      return storedRowsPerPage ? parseInt(storedRowsPerPage, 10) :25;
    }
    return 5;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenu, setOpenedMenu] = useState<null | string>(null);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<CustomPage[]>([]);

  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  useEffect(() => {
    dispatch(fetchMyCustomPages());
    return () => {
      dispatch(clearCustomPage());
    };
  }, [dispatch]);

   useEffect(() => {
    const handlePageCreated = (newPage: any) => {
      dispatch(addCustomPage(newPage));
    };
    const handlePageUpdated = (updatedPage: any) => {
      dispatch(updateCustomPageInList(updatedPage));
    };
    const handlePageDeleted = (pageId: string) => {
      dispatch(removeCustomPageFromList(pageId));
    };

    socket.on('customPageCreated', handlePageCreated);
    socket.on('customPageUpdated', handlePageUpdated);
    socket.on('customPageDeleted', handlePageDeleted);

    return () => {
      socket.off('customPageCreated', handlePageCreated);
      socket.off('customPageUpdated', handlePageUpdated);
      socket.off('customPageDeleted', handlePageDeleted);
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching pages:', error);
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    setFilteredRows(
      pages.filter((row) => row.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [pages, search]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenu(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedMenu(null);
  };

  const handleToggleStatus = (page: CustomPage) => {
    const newStatus = page.status === 'enabled' ? 'disabled' : 'enabled';
    dispatch(
      updateCustompageStatus({
        pageId: page._id,
        newStatus: newStatus,
      })
    ).then((result) => {
    });
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCustomPage(id)).then((result) => {});
    handleClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customPagesRowsPerPage', newRowsPerPage.toString());
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600}>
          Casino Custom Pages
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
        ) : filteredRows.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography>No pages found.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ whiteSpace: 'nowrap', minWidth: 750 }} aria-label="simple table">
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
                {[...filteredRows]
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {row.title || 'Untitled'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">
                          {row.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.author?.name || 'user not exist'}
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
                          onClick={() => handleToggleStatus(row)}
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
                          <NextLink href={`/content/custom-pages/${row._id}`} passHref>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IconPlus width={18} />
                              </ListItemIcon>
                              View
                            </MenuItem>
                          </NextLink>
                          <NextLink href={`/content/custom-pages/${row._id}/edit`} passHref>
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
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default CasinoCustomPagesList;