"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Modal,
  IconButton,
  SelectChangeEvent,
  TableSortLabel,
  TablePagination,
  Toolbar,
  InputAdornment
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import CloseIcon from '@mui/icons-material/Close';
import { IconSearch } from '@tabler/icons-react';

// Define interfaces/types
interface ScrapingDataItem {
  id: string;
  systemId: string;
  contentType: string;
  sourceUrl: string;
  status: string;
  lastModified: string;
  lastChangedBy: string;
  lastChangedAt: string;
  content: string;
  history?: HistoryEntry[];
}

interface HistoryEntry {
  field: keyof ScrapingDataItem;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilized = array.map((el, idx) => [el, idx] as [T, number]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

interface HeadCell {
  id: keyof ScrapingDataItem;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'systemId', numeric: false, disablePadding: false, label: 'System ID' },
  { id: 'contentType', numeric: false, disablePadding: false, label: 'Content Type' },
  { id: 'sourceUrl', numeric: false, disablePadding: false, label: 'Source URL' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'lastModified', numeric: false, disablePadding: false, label: 'Last Modified' },
  { id: 'lastChangedBy', numeric: false, disablePadding: false, label: 'Last Changed By' },
  { id: 'lastChangedAt', numeric: false, disablePadding: false, label: 'Last Changed At' },
  { id: 'content', numeric: false, disablePadding: false, label: 'Content' }
];

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof ScrapingDataItem) => void;
  order: Order;
  orderBy: keyof ScrapingDataItem;
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableProps) {
  const createSortHandler = (property: keyof ScrapingDataItem) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: "0.95rem" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ fontSize: "0.95rem" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface FiltersState {
  sourceUrl: string;
  status: string;
  contentType: string;
  lastChangedBy: string;
}

interface EnhancedTableToolbarProps {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  filters: FiltersState;
  handleFilterChange: (event: SelectChangeEvent | ChangeEvent<HTMLInputElement>) => void;
}

function EnhancedTableToolbar({ handleSearch, search, filters, handleFilterChange }: EnhancedTableToolbarProps) {
  return (
    <Toolbar sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: '8px', boxShadow: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ flex: '1 1 100%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            )
          }}
          placeholder="Search Content"
          size="small"
          onChange={handleSearch}
          value={search}
          sx={{ minWidth: 200 }}
        />

        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={filters?.status || ''} onChange={handleFilterChange} label="Status">
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Under Review">Under Review</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Content Type</InputLabel>
          <Select name="contentType" value={filters?.contentType || ''} onChange={handleFilterChange} label="Content Type">
            <MenuItem value="">All Content Types</MenuItem>
            <MenuItem value="Casino Review">Casino Review</MenuItem>
            <MenuItem value="Game Review">Game Review</MenuItem>
            <MenuItem value="Bonus">Bonus</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Last Changed By"
          name="lastChangedBy"
          value={filters?.lastChangedBy|| ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleFilterChange(e as SelectChangeEvent<string>)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 180 }}
        />
      </Box>
    </Toolbar>
  );
}

export default EnhancedTableToolbar;





