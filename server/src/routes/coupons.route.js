const express = require('express');

const router = express.Router();

const couponController = require('~/controllers/coupon.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.post('/validate', couponController.validate);

router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), couponController.index);
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), couponController.show);
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), couponController.store);
router.patch('/:id', authenticate, authorize('ADMIN', 'MANAGER'), couponController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), couponController.destroy);

module.exports = router;
