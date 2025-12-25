const express = require('express');

const {body} = require('express-validator');

const isAuth = require('../middleware/is-auth');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET -> FEEDS (all posts)
router.get('/posts', isAuth, feedController.getFeeds);

// POST -> FEED (create a post)
router.post('/post', isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5}), 
    ],
    feedController.postFeed
);

// GET -> FEED (Single Post)
router.get('/post/:postId', isAuth, feedController.getFeed);

// PUT -> FEED (Update Single Post)
router.put('/post/:postId', isAuth,
    [
        body('title').trim().isLength({min:5}),
        body('content').trim().isLength({min: 5}),
    ],
    feedController.updatePost
);

// DELETE -> FEED (Delete Single Post)
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;