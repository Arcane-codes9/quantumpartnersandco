const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { updateUser, updateTransactionStatus, updateTradeStatus, notifyUser, getUsersTable, getTradesTable, getTransactionsTable, deleteUser, deleteTransaction, deleteTrade } = require('../controllers/adminController');

// User balance/profit update
router.post('/user/update', authenticateToken, admin, updateUser);
// Transaction status update
router.post('/transaction/update', authenticateToken, admin, updateTransactionStatus);
// Trade status update
router.post('/trade/update', authenticateToken, admin, updateTradeStatus);
// Send notification and email
router.post('/user/notify', authenticateToken, admin, notifyUser);
// Get all users
router.get('/users', authenticateToken, admin, getUsersTable);
// Gett all trades
router.get('/trades', authenticateToken, admin, getTradesTable);
// Get all transactions
router.get('/transactions', authenticateToken, admin, getTransactionsTable);
// Delete user and all associated data
router.delete('/user/:userId', authenticateToken, admin, deleteUser);
router.delete('/transaction/:transactionId', authenticateToken, admin, deleteTransaction);
router.delete('/trade/:tradeId', authenticateToken, admin, deleteTrade);

module.exports = router;
