const express = require('express');

const router = express.Router();

const userController = require('~/controllers/user.controller');

const { authenticate } = require('~/middlewares/authenticate');

const { authorize } = require('~/middlewares/rbac');

const { uploadAvatar } = require('~/middlewares/uploadAvatar');

// me
router.get('/me', authenticate, userController.me);
router.patch('/me', authenticate, userController.updateMe);
router.patch('/me/avatar', authenticate, uploadAvatar.single('avatar'), userController.updateAvatar);

// admin
router.get('/', authenticate, authorize('admin', 'manager'), userController.index);
router.post('/', authenticate, authorize('admin', 'manager'), userController.store);
router.get('/:id', authenticate, authorize('admin', 'manager'), userController.show);
router.patch('/:id', authenticate, authorize('admin', 'manager'), userController.update);
router.delete('/:id', authenticate, authorize('admin', 'manager'), userController.destroy);

module.exports = router;
