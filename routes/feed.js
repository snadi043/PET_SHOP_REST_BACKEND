const express = require('express');

const {body} = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET -> FEEDS (all posts)
router.get('/posts', feedController.getFeeds);

// POST -> FEED (create a post)
router.post('/post', 
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5}), 
    ],
    feedController.postFeed
);

// GET -> FEED (Single Post)
router.get('/post/:postId', feedController.getFeed);

// PUT -> FEED (Update Single Post)
router.put('/post/:postId',
    [
        body('title').trim().isLength({min:5}),
        body('content').trim().isLength({min: 5}),
    ],
    feedController.updatePost
);

module.exports = router;