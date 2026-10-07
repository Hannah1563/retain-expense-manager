const User = require('../models/User');
const Expense = require('../models/Expense');

const getAdminInsights = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalExpenses,
    totalValueResult,
    monthlyExpenses,
    spendingByCategory,
    recentExpenses,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Expense.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Expense.countDocuments({ date: { $gte: startOfMonth } }),
    Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', total: 1, count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Expense.find().populate('user', 'name').populate('category').sort({ createdAt: -1 }).limit(5),
    User.find().select('-password').sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    totalUsers,
    totalExpenses,
    totalValue: totalValueResult[0]?.total || 0,
    monthlyExpenses,
    spendingByCategory,
    top5Categories: spendingByCategory.slice(0, 5),
    bottom5Categories: [...spendingByCategory].sort((a, b) => a.count - b.count).slice(0, 5),
    recentExpenses,
    recentUsers,
  });
};

module.exports = { getAdminInsights };
