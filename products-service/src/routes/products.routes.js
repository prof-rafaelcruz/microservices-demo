const express = require('express');
const productsController = require('../controllers/products.controller');
const requireAdmin = require('../middlewares/require-admin');

const router = express.Router();

router.get('/', productsController.list);
router.get('/:id', productsController.get);
router.post('/', requireAdmin, productsController.create);
router.put('/:id', requireAdmin, productsController.replace);
router.patch('/:id', requireAdmin, productsController.update);
router.delete('/:id', requireAdmin, productsController.remove);

module.exports = router;