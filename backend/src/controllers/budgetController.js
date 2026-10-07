const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const getBudget = async (req, res) => {
  const { month, year } = req.query;
  const budget = await Budget.findOne({ user: req.user._id, month: Number(month), year: Number(year) });
  if (!budget) return res.json(null);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const result = await Expense.aggregate([
    { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const spent = result[0]?.total || 0;
  res.json({ ...budget.toObject(), spent, remaining: budget.amount - spent });
};

const upsertBudget = async (req, res) => {
  const { month, year, amount } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, month, year },
    { amount },
    { upsert: true, new: true }
  );
  res.json(budget);
};

module.exports = { getBudget, upsertBudget };
