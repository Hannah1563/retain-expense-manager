import { useEffect, useState, FormEvent } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, LinearProgress, Chip, CircularProgress } from '@mui/material';
import { Budget } from '../types';
import api from '../api/axios';

export default function BudgetPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchBudget = () => {
    setLoading(true);
    api.get('/budget', { params: { month, year } })
      .then((r) => { setBudget(r.data); if (r.data) setAmount(r.data.amount.toString()); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBudget(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budget', { month, year, amount: Number(amount) });
      setSaved(true);
      fetchBudget();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save budget');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const percent = budget ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
  const status = percent >= 100 ? 'error' : percent >= 80 ? 'warning' : 'success';

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Monthly Budget — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Set Budget</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {saved && <Alert severity="success" sx={{ mb: 2 }}>Budget saved!</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Budget Amount ($)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required slotProps={{ htmlInput: { min: 0, step: '0.01' } }} fullWidth />
          <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>Save Budget</Button>
        </Box>
      </Paper>

      {budget && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Budget Overview</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Budget</Typography>
            <Typography sx={{ fontWeight: 600 }}>${budget.amount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Spent</Typography>
            <Typography sx={{ fontWeight: 600 }}>${budget.spent.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Remaining</Typography>
            <Typography sx={{ fontWeight: 600, color: status === 'error' ? 'error.main' : 'inherit' }}>
              ${budget.remaining.toFixed(2)}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={percent} color={status} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
          <Chip
            label={percent >= 100 ? '🚨 Over Budget' : percent >= 80 ? '⚠️ Approaching Limit' : '✅ Within Budget'}
            color={status}
          />
        </Paper>
      )}
    </Box>
  );
}
