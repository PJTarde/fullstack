const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminMetrics } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/metrics', protectAdmin, getAdminMetrics);

module.exports = router;
