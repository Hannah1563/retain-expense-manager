require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const categories = [
  { name: 'Food & Dining', color: '#f44336' },
  { name: 'Transport', color: '#2196f3' },
  { name: 'Shopping', color: '#9c27b0' },
  { name: 'Entertainment', color: '#ff9800' },
  { name: 'Health', color: '#4caf50' },
  { name: 'Housing', color: '#795548' },
  { name: 'Education', color: '#00bcd4' },
  { name: 'Travel', color: '#3f51b5' },
  { name: 'Utilities', color: '#607d8b' },
  { name: 'Other', color: '#9e9e9e' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  for (const cat of categories) {
    await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true });
  }
  console.log('✅ Categories seeded');
  process.exit(0);
}).catch((err) => { console.error(err); process.exit(1); });
