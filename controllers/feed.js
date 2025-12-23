const fs = require('fs');

const path = require('path');

const {validationResult} = require('express-validator');

const Post = require('../models/post');

exports.getFeeds = (req, res, next) => {
    Post.find().then(posts => {
        if(!posts){
            const error = new Error('Fetching Post failed');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Successfully Fetched the Posts',
            posts: posts
        });
    }) 
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getFeed = ((req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Unable to fetch the post');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Fetched Post Successfully', post: post});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
});

exports.postFeed = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Posting status failed.');
        error.statusCode = 422;
        throw error;
    };
    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.message;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name: '$@!',
        }
    });
    post.save().then((result) => {
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully',
            post: result
    }).catch((err) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next (err);
        });
    });
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
        if(!errors.isEmpty){
            const error = new Error('Updating Post Failed');
            error.statusCode = 422;
            throw error;
        }
        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.image;
        if(req.file){
            imageUrl = req.file.path;
        }
        if(!imageUrl){
            const error = new Error('No file picked');
            error.statusCode = 422;
            throw error;
        }
        Post.findById(postId)
        .then(post => {
            if(imageUrl !== post.imageUrl){
                deleteImage(post.imageUrl);
            }
            if(!post){
            const error = new Error('Unable to find the post');
            error.statusCode = 404;
            throw error;
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    }).then(result => {
        res.status(200).json({message: 'Updated Post Successfully', post: result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

const deleteImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => {
        if(err){
            throw err;
        }
        console.log(filePath, 'is deleted.');
    });
}