import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Chip, CircularProgress, LinearProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import api from '../api/axios';
import { Expense, Budget, Category } from '../types';

interface DashboardData {
  totalSpent: number;
  highestExpense: Expense | null;
  recentExpenses: Expense[];
  byCategory: { category: Category; total: number }[];
}

export default function Dashboard() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const [data, setData] = useState<DashboardData | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 0, 23, 59, 59).toISOString();

    Promise.all([
      api.get('/expenses', { params: { startDate: start, endDate: end, limit: 100 } }),
      api.get('/budget', { params: { month, year } }),
    ]).then(([expRes, budRes]) => {
      const expenses: Expense[] = expRes.data.expenses;
      const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
      const highestExpense = expenses.reduce<Expense | null>((max, e) => (!max || e.amount > max.amount ? e : max), null);
      const categoryMap = new Map<string, { category: Category; total: number }>();
      expenses.forEach((e) => {
        const key = e.category._id;
        if (!categoryMap.has(key)) categoryMap.set(key, { category: e.category, total: 0 });
        categoryMap.get(key)!.total += e.amount;
      });
      setData({ totalSpent, highestExpense, recentExpenses: expenses.slice(0, 5), byCategory: [...categoryMap.values()] });
      setBudget(budRes.data);
    }).catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const budgetPercent = budget ? Math.min((data!.totalSpent / budget.amount) * 100, 100) : 0;
  const budgetStatus = !budget ? null : budgetPercent >= 100 ? 'error' : budgetPercent >= 80 ? 'warning' : 'success';

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="body2" color="text.secondary">Total Spent</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>${data?.totalSpent.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccountBalanceWalletIcon color="primary" />
              <Typography variant="body2" color="text.secondary">Remaining Budget</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {budget ? `$${budget.remaining.toFixed(2)}` : 'Not set'}
            </Typography>
            {budget && (
              <LinearProgress variant="determinate" value={budgetPercent} color={budgetStatus!} sx={{ mt: 1 }} />
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ReceiptLongIcon color="primary" />
              <Typography variant="body2" color="text.secondary">Highest Expense</Typography>
            </Box>
            {data?.highestExpense ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>${data.highestExpense.amount.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">{data.highestExpense.title}</Typography>
              </>
            ) : <Typography>None</Typography>}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Budget Status</Typography>
            {budget ? (
              <Chip
                label={budgetPercent >= 100 ? 'Over Budget' : budgetPercent >= 80 ? 'Approaching Limit' : 'Within Budget'}
                color={budgetStatus!}
              />
            ) : <Chip label="No Budget Set" />}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Spending by Category</Typography>
            {data?.byCategory.length === 0 && <Typography color="text.secondary">No expenses this month</Typography>}
            {data?.byCategory.map(({ category, total }) => (
              <Box key={category._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip label={category.name} size="small" sx={{ bgcolor: category.color, color: '#fff' }} />
                <Typography sx={{ fontWeight: 600 }}>${total.toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Recent Expenses</Typography>
            {data?.recentExpenses.length === 0 && <Typography color="text.secondary">No expenses this month</Typography>}
            {data?.recentExpenses.map((e) => (
              <Box key={e._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{e.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(e.date).toLocaleDateString()}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>${e.amount.toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
