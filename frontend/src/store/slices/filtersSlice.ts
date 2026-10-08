import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseFilters } from '../../types';

const initialState: ExpenseFilters = {
  search: '',
  category: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  order: 'desc',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<ExpenseFilters>>) => {
      const { page, ...rest } = action.payload;
      return { ...state, ...rest, page: page ?? (Object.keys(rest).length > 0 ? 1 : state.page) };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
