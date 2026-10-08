import { Paper, Typography } from '@mui/material';

interface Props {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Paper>
  );
}
