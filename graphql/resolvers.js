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

// Importing the "bcrypt" pacakge to implement password hashing for security concerns.
const bcrypt = require('bcrypt');

module.exports = {
    // To access the input fields there is an args property in graphql or otherwise object destructring also works.
    // createUser(args, req) {

    // }
    // Creating the createUser function with async and await concepts for the graphql to handle the requests efficiently.
    createUser: async function({userInput}, req){
        const email = userInput.email;
        const name = userInput.name;
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            const error = new Error('An user with given email already exists.');
            error.statusCode = 422;
            throw error;
        }
        // Also, in the process of creating a new user, dealing with the passwords are also important concept.
        // So, as did in the REST application, here also integrating the graphql enpoint with "bcrypt" package is highly neccessary.
        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user = new User({email: email, name: name, password: hashedPassword});
        const createdUser = await user.save();

        return { ...createdUser._doc, _id: createdUser._id.toString()};
        },
    }
