import { Box, Typography, Chip, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expense } from '../../types';

interface Props {
  expense: Expense;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseCard({ expense, onEdit, onDelete }: Props) {
  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{expense.title}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip label={expense.category.name} size="small" sx={{ bgcolor: expense.category.color, color: '#fff' }} />
            <Chip label={expense.paymentMethod.replace('_', ' ')} size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {new Date(expense.date).toLocaleDateString()}
            </Typography>
          </Box>
          {expense.notes && <Typography variant="caption" color="text.secondary">{expense.notes}</Typography>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontWeight: 700, mr: 1 }}>${expense.amount.toFixed(2)}</Typography>
          <IconButton size="small" onClick={() => onEdit(expense)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(expense._id)}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
