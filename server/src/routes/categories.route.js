const express = require('express');

const router = express.Router();

const categoryController = require('~/controllers/category.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.get('/', categoryController.index);
router.get('/:id', categoryController.show);

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), categoryController.store);
router.patch('/:id', authenticate, authorize('ADMIN', 'MANAGER'), categoryController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), categoryController.destroy);

module.exports = router;
