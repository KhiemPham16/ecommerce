const express = require('express');

const router = express.Router();

const postController = require('~/controllers/post.controller');

const { authenticate } = require('~/middlewares/authenticate');
const { authorize } = require('~/middlewares/rbac');

router.get('/', postController.index);

router.get('/admin', authenticate, authorize('ADMIN', 'MANAGER', 'EMPLOYEE'), postController.getAdminPosts);

router.get('/:slug', postController.show);

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), postController.store);

router.patch('/:id', authenticate, authorize('ADMIN', 'MANAGER'), postController.update);

router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), postController.destroy);

module.exports = router;
