import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { SetStateAction } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Toolbar,
  TextField,
  InputAdornment,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { visuallyHidden } from '@mui/utils';


import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';

interface CustomField {
  id: number;
  name: string;
  type: string;
  contentType: string;
  options?: string | string[] | Record<string, any>;
}

const fieldTypes = [
  { value: 'text', label: 'Text Field' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown-single', label: 'Dropdown (Single-Select)' },
  { value: 'dropdown-multi', label: 'Dropdown (Multi-Select)' },
  { value: 'image', label: 'Image/Media Upload' },
  { value: 'boolean', label: 'Toggle (Yes/No)' },
  { value: 'group', label: 'Repeatable Group' },
];

const contentTypes = [
  { value: 'For All', label: 'General' },
  { value: 'casino', label: 'Casino' },
  { value: 'game', label: 'Game' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'page', label: 'Page' },

];

const headCells = [
  { id: 'name', label: 'Field Name', numeric: false, disablePadding: false },
  { id: 'type', label: 'Type', numeric: false, disablePadding: false },
  { id: 'contentType', label: 'Content Type', numeric: false, disablePadding: false },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: any) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: "0.950rem" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  handleSearch: ChangeEvent<HTMLInputElement> | any;
  search: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleSearch, search } = props;

  return (
    <Toolbar>
      <Box sx={{ flex: "1 1 100%" }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
          placeholder="Search Custom Field"
          size="small"
          onChange={handleSearch}
          value={search}
        />
      </Box>  
    </Toolbar>
  );
};

const CustomFieldsSettings = () => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const [fields, setFields] = useState<CustomField[]>([
    { id: 1, name: 'Bonus Code', type: 'text', contentType: 'casino' },
    { id: 2, name: 'RTP', type: 'number', contentType: 'game' },
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newContentType, setNewContentType] = useState('casino');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<any>("name");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedRowsPerPage = localStorage.getItem('customFieldsRowsPerPage');
      return storedRowsPerPage ? parseInt(storedRowsPerPage, 10) : 5;
    }
    return 5;
  });
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<any>(fields);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRows(fields);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fields]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const filteredRows = fields.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value);
    });
    setSearch(event.target.value);
    setRows(filteredRows);
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customFieldsRowsPerPage', rowsPerPage.toString());
    }
  }, [rowsPerPage]);

  const handleAddField = () => {
    if (newFieldName.trim() && newFieldType && newContentType) {
      const newField: CustomField = {
        id: fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1,
        name: newFieldName.trim(),
        type: newFieldType,
        contentType: newContentType,
        options: newFieldOptions,
      };
      setFields([...fields, newField]);
      setNewFieldName('');
      setNewFieldType('text');
      setNewContentType('casino');
      setNewFieldOptions('');
    }
  };

  const handleUpdateField = () => {
    if (editingFieldId !== null && newFieldName.trim() && newFieldType && newContentType) {
      setFields(fields.map(field => 
        field.id === editingFieldId 
          ? { ...field, name: newFieldName.trim(), type: newFieldType, contentType: newContentType, options: newFieldOptions }
          : field
      ));
      setEditingFieldId(null);
      setNewFieldName('');
      setNewFieldType('text');
      setNewContentType('casino');
      setNewFieldOptions('');
    }
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setNewFieldName('');
    setNewFieldType('text');
    setNewContentType('casino');
    setNewFieldOptions('');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const borderColor = theme.palette.divider;

  const renderFieldOptions = () => {
    if (newFieldType === 'dropdown-single' || newFieldType === 'dropdown-multi') {
      return (
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="field-options">
            Dropdown Options (comma-separated)
          </CustomFormLabel>
          <CustomTextField
            id="field-options"
            value={newFieldOptions}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewFieldOptions(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="e.g., Option 1, Option 2, Option 3"
          />
        </Grid>
      );
    } else if (newFieldType === 'image') {
      return (
        <Grid item xs={12}>
            <Button variant="outlined" disabled>Upload</Button>
        </Grid>
      );
    } else if (newFieldType === 'group') {
      return (
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="field-options">
            Group Fields (JSON format)
          </CustomFormLabel>
          <CustomTextField
            id="field-options"
            value={newFieldOptions}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewFieldOptions(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder='e.g., { "question": "text", "answer": "textarea" }'
          />
        </Grid>
      );
    }
    return null;
  }

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              Custom Fields Settings
            </Typography>
          </Box>
      <Box sx={{ p: 2 }}>
        
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>

            <form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="field-name">
                    Field Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="field-name"
                    value={newFieldName}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewFieldName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="e.g., Bonus Code, RTP"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="field-type">
                    Field Type
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="field-type"
                    name="field-type"
                    value={newFieldType}
                    onChange={(e: { target: { value: string; }; }) => setNewFieldType(e.target.value as string)}
                  >
                    {fieldTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                {renderFieldOptions()}
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="content-type">
                    Content Type
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="content-type"
                    name="content-type"
                    value={newContentType}
                    onChange={(e: { target: { value: string; }; }) => setNewContentType(e.target.value as string)}
                  >
                    {contentTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} sm={6} display="flex" alignItems="flex-end">
                  {editingFieldId !== null ? (
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="primary" onClick={handleUpdateField}>
                        Update Field
                      </Button>
                      <Button variant="outlined" color="error" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </Stack>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleAddField}>
                      Add Field
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 4 }} />

            <EnhancedTableToolbar
              search={search}
              handleSearch={(event: any) => handleSearch(event)}
            />
            <Paper variant="outlined" sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}>
              {loading ? (
                <Box sx={{ textAlign: "center", p: 4 }}>
                  <CircularProgress />
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: any, index) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                              <TableCell>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {row.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.type}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                  {row.contentType}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        </BlankCard>
      </Grid>
    </Grid>
    </Box>
    </BlankCard>
  );
};

export default CustomFieldsSettings;
