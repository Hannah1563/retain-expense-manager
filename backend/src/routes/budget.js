const router = require('express').Router();
const { getBudget, upsertBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBudget);
router.post('/', upsertBudget);

module.exports = router;
