import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  MenuItem, Box, Alert,
} from '@mui/material';
import { Expense, Category, PaymentMethod } from '../../types';
import api from '../../api/axios';

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: Category[];
  expense?: Expense | null;
}

export default function ExpenseForm({ open, onClose, onSaved, categories, expense }: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(expense?.title || '');
      setAmount(expense?.amount?.toString() || '');
      setCategory(expense?.category._id || '');
      setDate(expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setPaymentMethod(expense?.paymentMethod || 'cash');
      setNotes(expense?.notes || '');
      setError('');
    }
  }, [open, expense]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { title, amount: Number(amount), category, date, paymentMethod, notes };
      if (expense) await api.put(`/expenses/${expense._id}`, payload);
      else await api.post('/expenses', payload);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save expense');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{expense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required fullWidth slotProps={{ htmlInput: { min: 0, step: '0.01' } }} />
          <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required fullWidth>
            {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          <TextField select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} required fullWidth>
            {PAYMENT_METHODS.map((m) => <MenuItem key={m} value={m}>{m.replace('_', ' ')}</MenuItem>)}
          </TextField>
          <TextField label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
