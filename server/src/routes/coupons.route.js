const express = require('express');

const router = express.Router();

const couponController = require('~/controllers/coupon.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.post('/validate', couponController.validate);

router.get('/', authenticate, authorize('admin', 'manager'), couponController.index);
router.get('/:id', authenticate, authorize('admin', 'manager'), couponController.show);
router.post('/', authenticate, authorize('admin', 'manager'), couponController.store);
router.patch('/:id', authenticate, authorize('admin', 'manager'), couponController.update);
router.delete('/:id', authenticate, authorize('admin', 'manager'), couponController.destroy);

module.exports = router;
