const fs = require('fs');

const path = require('path');

const {validationResult} = require('express-validator');

const Post = require('../models/post');
const User = require('../models/users');

exports.getFeeds = async(req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    try{
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
    
        if(!posts){
            const error = new Error('Fetching Post failed');
            error.statusCode = 404;
            throw error;
        }
    
        res.status(200).json({
            message: 'Successfully Fetched the Posts',
            posts: posts,
            totalItems: totalItems
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    };    
}

exports.getFeed = async(req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    try{
        if(!post){
            const error = new Error('Unable to fetch the post');
            error.statusCode = 404;
            throw error;
        }
        await res.status(200).json({message: 'Fetched Post Successfully', post: post});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    };
};

exports.postFeed = async(req, res, next) => {
    const errors = validationResult(req);
    try{
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
            creator: req.userId,
        });
        await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: 'Post created successfully',
            post: post,
            creator: { id: user._id, name: user.name}
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next (err);
    };
}

exports.updatePost = async(req, res, next) => {
    const postId = req.params.postId;
    try{
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
            const post = Post.findById(postId)
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
            await post.save();
            const result = await res.status(200).json({message: 'Updated Post Successfully', post: result});
        }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    };
}


exports.deletePost = async(req, res, next) => {
    const postId = req.params.postId;
    const post = Post.findById(postId)
    try{
        if(!post){
            const error = new Error('Unable to delete post');
            error.statusCode = 422;
            throw err;
        }
        deleteImage(post.imageUrl);
        await Post.findByIdAndDelete(postId);
    const result = await res.status(200).json({message: 'Successfully Deleted the Post', post: result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    };
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