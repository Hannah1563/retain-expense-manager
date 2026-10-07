import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, TextField, MenuItem, Grid, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Pagination, CircularProgress, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RootState } from '../store';
import { setFilter, resetFilters } from '../store/slices/filtersSlice';
import { Expense, Category, PaginatedExpenses } from '../types';
import api from '../api/axios';
import ExpenseForm from '../components/expenses/ExpenseForm';

const PAYMENT_METHODS = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'];

export default function Expenses() {
  const dispatch = useDispatch();
  const filters = useSelector((s: RootState) => s.filters);
  const [data, setData] = useState<PaginatedExpenses | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const fetchExpenses = () => {
    setLoading(true);
    api.get('/expenses', { params: { ...filters } })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data)); }, []);
  useEffect(() => { fetchExpenses(); }, [filters]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Expenses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Expense
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField fullWidth label="Search" value={filters.search} onChange={(e) => dispatch(setFilter({ search: e.target.value }))} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField select fullWidth label="Category" value={filters.category} onChange={(e) => dispatch(setFilter({ category: e.target.value }))}>
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField select fullWidth label="Payment" value={filters.paymentMethod} onChange={(e) => dispatch(setFilter({ paymentMethod: e.target.value }))}>
              <MenuItem value="">All</MenuItem>
              {PAYMENT_METHODS.map((m) => <MenuItem key={m} value={m}>{m.replace('_', ' ')}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField fullWidth label="From" type="date" value={filters.startDate} onChange={(e) => dispatch(setFilter({ startDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField fullWidth label="To" type="date" value={filters.endDate} onChange={(e) => dispatch(setFilter({ endDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Button fullWidth variant="outlined" onClick={() => dispatch(resetFilters())} sx={{ height: '100%' }}>Reset</Button>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField select label="Sort By" value={filters.sortBy} onChange={(e) => dispatch(setFilter({ sortBy: e.target.value }))} size="small">
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </TextField>
          <TextField select label="Order" value={filters.order} onChange={(e) => dispatch(setFilter({ order: e.target.value as 'asc' | 'desc' }))} size="small">
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.expenses.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center">No expenses found</TableCell></TableRow>
                )}
                {data?.expenses.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>${e.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={e.category.name} size="small" sx={{ bgcolor: e.category.color, color: '#fff' }} />
                    </TableCell>
                    <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                    <TableCell>{e.paymentMethod.replace('_', ' ')}</TableCell>
                    <TableCell>{e.notes || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => { setEditing(e); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(e._id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data && data.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={data.pages} page={filters.page} onChange={(_, p) => dispatch(setFilter({ page: p }))} />
            </Box>
          )}
        </>
      )}

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchExpenses}
        categories={categories}
        expense={editing}
      />
    </Box>
  );
}
