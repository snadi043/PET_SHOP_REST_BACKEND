const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/feeds', feedController.getFeed);

router.post('/feed', feedController.postFeed);

module.exports = router;