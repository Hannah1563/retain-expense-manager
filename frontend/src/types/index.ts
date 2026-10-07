export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Category {
  _id: string;
  name: string;
  color: string;
}

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'other';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  user: string;
  createdAt: string;
}

export interface Budget {
  _id: string;
  month: number;
  year: number;
  amount: number;
  spent: number;
  remaining: number;
}

export interface ExpenseFilters {
  search: string;
  category: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
}

export interface PaginatedExpenses {
  expenses: Expense[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalValue: number;
  monthlyExpenses: number;
  spendingByCategory: { _id: string; name: string; total: number; count: number }[];
  top5Categories: { _id: string; name: string; total: number; count: number }[];
  bottom5Categories: { _id: string; name: string; total: number; count: number }[];
  recentExpenses: Expense[];
  recentUsers: User[];
}
