const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  const { category, paymentMethod, startDate, endDate, search, sortBy, order, page = 1, limit = 10 } = req.query;
  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (startDate || endDate) filter.date = {};
  if (startDate) filter.date.$gte = new Date(startDate);
  if (endDate) filter.date.$lte = new Date(endDate);
  if (search) filter.title = { $regex: search, $options: 'i' };

  const sort = {};
  if (sortBy) sort[sortBy] = order === 'asc' ? 1 : -1;
  else sort.date = -1;

  const skip = (Number(page) - 1) * Number(limit);
  const [expenses, total] = await Promise.all([
    Expense.find(filter).populate('category').sort(sort).skip(skip).limit(Number(limit)),
    Expense.countDocuments(filter),
  ]);
  res.json({ expenses, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

const createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user._id });
  res.status(201).json(await expense.populate('category'));
};

const updateExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  Object.assign(expense, req.body);
  await expense.save();
  res.json(await expense.populate('category'));
};

const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Deleted' });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
