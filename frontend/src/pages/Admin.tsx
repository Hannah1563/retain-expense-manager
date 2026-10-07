import { useEffect, useState, FormEvent } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AdminInsights, Category } from '../types';
import api from '../api/axios';

function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [error, setError] = useState('');

  const fetch = () => api.get('/categories').then((r) => setCategories(r.data));
  useEffect(() => { fetch(); }, []);

  const openForm = (cat?: Category) => {
    setEditing(cat || null);
    setName(cat?.name || '');
    setColor(cat?.color || '#1976d2');
    setError('');
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/categories/${editing._id}`, { name, color });
      else await api.post('/categories', { name, color });
      fetch();
      setOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    fetch();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Categories</Typography>
        <Button size="small" startIcon={<AddIcon />} variant="contained" onClick={() => openForm()}>Add</Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell><Chip label={c.name} size="small" sx={{ bgcolor: c.color, color: '#fff' }} /></TableCell>
                <TableCell>{c.color}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openForm(c)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
            <TextField label="Color" type="color" value={color} onChange={(e) => setColor(e.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Paper>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Paper>
  );
}

export default function Admin() {
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/insights').then((r) => setInsights(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Users" value={insights!.totalUsers} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Expenses" value={insights!.totalExpenses} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Value" value={`$${insights!.totalValue.toFixed(2)}`} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="This Month" value={insights!.monthlyExpenses} /></Grid>

        <Grid size={{ xs: 12, md: 6 }}><CategoryManager /></Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Top 5 Categories</Typography>
            {insights!.top5Categories.map((c) => (
              <Box key={c._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{c.name}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{c.count} expenses</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Bottom 5 Categories</Typography>
            {insights!.bottom5Categories.map((c) => (
              <Box key={c._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{c.name}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{c.count} expenses</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Recently Added Expenses</Typography>
            {insights!.recentExpenses.map((e) => (
              <Box key={e._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body2">{e.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{(e.user as any)?.name}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>${e.amount.toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Recently Registered Users</Typography>
            {insights!.recentUsers.map((u) => (
              <Box key={u._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{u.name}</Typography>
                <Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
