const Category = require('../models/Category');
const Expense = require('../models/Expense');

const getCategories = async (req, res) => {
  res.json(await Category.find().sort('name'));
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  // Reassign expenses using this category to 'Uncategorized'
  let fallback = await Category.findOne({ name: 'Uncategorized' });
  if (!fallback) fallback = await Category.create({ name: 'Uncategorized', color: '#9e9e9e' });
  await Expense.updateMany({ category: req.params.id }, { category: fallback._id });

  res.json({ message: 'Deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
