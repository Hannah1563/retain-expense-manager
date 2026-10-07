const router = require('express').Router();
const { getAdminInsights } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/insights', protect, adminOnly, getAdminInsights);

module.exports = router;
