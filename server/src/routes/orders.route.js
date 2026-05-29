const express = require('express');

const router = express.Router();

const orderController = require('~/controllers/order.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.use(authenticate);

router.post('/', orderController.store);
router.get('/my-orders', orderController.myOrders);
router.get('/my-orders/:id', orderController.showMine);
router.patch('/my-orders/:id/cancel', orderController.cancelMine);

router.get('/', authorize('admin', 'manager'), orderController.index);
router.patch('/:id/status', authorize('admin', 'manager'), orderController.updateStatus);

module.exports = router;
