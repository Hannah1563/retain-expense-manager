const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'], required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
