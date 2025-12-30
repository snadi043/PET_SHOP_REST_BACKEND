// module.exports = {
//     hello() {
//         return {
//             text: 'Hello World',
//             views: 54312
//         }
//     }
// }

// In this file, the resolver for the createUser() endpoint which is a mutation is designed.
// As a comparision of graphql with REST concepts the resolvers can be identified as controllers in REST.
// As the purpose of the controllers is to navigate the data by communicating with the clinet and the database, the graphql also allows us to perform such tasks.
// So, the User model is also imported in this file to perform the related tasks of communicating with the databases.
const User = require('../models/users');
const Post = require('../models/post');

// Importing the "bcrypt" package to implement password hashing for security concerns.
const bcrypt = require('bcrypt');

// Importing the "validator" package to implement validation in the graphql queries.
const validator = require('validator');

// Importing the "jsonwebtoken" to sign the "token" and validate the user to then pass it with all the request over the graphql queries to establish authentication.
const jwt = require('jsonwebtoken');

const isAuth = require('../middleware/auth');

module.exports = {
    // To access the input fields there is an args property in graphql or otherwise object destructring also works.
    // createUser(args, req) {

    // }

    // Creating the createUser function with async and await concepts for the graphql to handle the requests efficiently.
    createUser: async function({userInput}, req){
        // Creating errors array to catch the errors when dealing with graphql queries.
        const errors = [];
        if(!validator.isEmail(userInput.email)){
            errors.push({message: 'Email is not valid'});
        }
        if(!validator.isLength(userInput.password, {min: 5}) || !validator.isEmpty(userInput.password)){
            errors.push({message: 'Password is too short.'});
        }
        if(errors.length > 0){
            const error = new Error('Invalid Input');
            throw error;
        }
        const email = userInput.email;
        const name = userInput.name;
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            const error = new Error('An user with given email already exists.');
            error.statusCode = 422;
            error.data = errors;
            throw error;
        }
        // Also, in the process of creating a new user, dealing with the passwords are also important concept.
        // So, as did in the REST application, here also integrating the graphql enpoint with "bcrypt" package is highly neccessary.
        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user = new User({email: email, name: name, password: hashedPassword});
        const createdUser = await user.save();

        return { ...createdUser._doc, _id: createdUser._id.toString()};
        },

        // login function is resolver for the login query which is responsible to handle the login functionalities in the application using graphql. 
        login: async function ({email, password}){
            const user = await User.findOne({email: email});
            if(!email){
                const error = new Error('Unable to find the user provided email.');
                error.statusCode = 422;
                throw error;
            }
            if(!user){
                const error = new Error('Unable to find the user with given details.');
                error.statusCode = 401;
                throw error;
            }
            const passwordIsMatched = await bcrypt.compare(password, user.password);
            if(!passwordIsMatched){
                const error = new Error('Password is not valid.');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                userId: user._id.toString(),
                email: user.email
            }, 'supersecretfortheapplication',
            {
                expiresIn: '1h'
            });
            return { token: token, userId: user._id.toString()};
        },

        createPost: async function ({postInput}, req){
            const errors = [];
            if(!validator.isLength(title, {min: 5}) || !validator.isEmpty(title)){
                errors.push({message: 'Title field is either empty or too short.'});
            }
            if(!validator.isLength(content, {min: 5}) || !validator.isEmpty(content)){
                errors.push({message: 'Content filed is either empty or too short'});
            }
            if(errors.length > 0){
                const error = new Error('Invalid Input.');
                throw error;
            }
            const user = await User.findById(req.userId);
            if(!user){
                const error = new Error('Unable to find the user');
                error.statusCode = 422;
                throw error;
            }
            const post = new Post({
                title: postInput.title,
                content: postInput.content,
                imageUrl: postInput.imageUrl,
                creator: user,
            });
            const updatedPost = await post.save();
            // Assign the posts to the user.
            user.posts.push(updatedPost);
            await user.save();
            return { ...updatedPost._doc, 
                    _id: updatedPost._id.toString(), 
                    createdAt: updatedPost.createdAt.toISOString(), 
                    updatedAt: updatedPost.updatedAt.toISOString(),
                };
        },
        posts: async function({page}, req){
            if(!page){
                page = 1;
            }
            const perPage = 2;
            const isAuth = req.isAuth;
            if(!isAuth){
                const error = new Error('User is not authenticated');
                error.statusCode = 422;
                throw error;
            }
            const totalPosts = await Post.find().countDocuments();
            const posts = await Post
                            .find()
                            .skip((page - 1) * perPage)
                            .limit(perPage)
                            sort({createdAt: -1}).populate('creator');
            return {
                posts: posts.map(p => {
                    return {
                        ...p._doc,
                        _id: p._id.toString(),
                        createdAt: p.createdAt.toISOString(),
                        updatedAt: p.updatedAt.toISOString(),
                    }
                }),
                totalPosts: totalPosts,
            }
        },

        getPost: async function({postId}, req){
            const isAuth = req.isAuth;
            if(!isAuth){
                const error = new Error('User not authenticated');
                error.statusCode = 401;
                throw error;
            }
            const post = await Post.findById(postId).populate('creator');
            if(!post){
                const error = new Error('Unable to find the post');
                error.statusCode = 404;
                throw error;
            }
            return { 
                ...post._doc, 
                _id: post._id.toString(), 
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString()    
            };
        }
    }
