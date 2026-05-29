const express = require('express');

const router = express.Router();

const productController = require('~/controllers/product.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.get('/', productController.index);
router.get('/:id', productController.show);

router.post('/', authenticate, authorize('admin', 'manager'), productController.store);
router.patch('/:id', authenticate, authorize('admin', 'manager'), productController.update);
router.delete('/:id', authenticate, authorize('admin', 'manager'), productController.destroy);

module.exports = router;
