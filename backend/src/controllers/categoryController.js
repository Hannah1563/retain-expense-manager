const Category = require('../models/Category');

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
  res.json({ message: 'Deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
