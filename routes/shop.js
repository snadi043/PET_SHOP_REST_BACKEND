const express = require('express');

const router = express.Router();

const shopController = require('../controllers/admin/products');

router.get('/', shopController.getProduct);

module.exports = router;