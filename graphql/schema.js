// In this file the schema of the graphql query is defined.
// For this schema, the buildSchema has to be imported from the "graphql" package.

const { buildSchema } = require('graphql');

// The schema has to be exported so that it can be used in the middleware in the application where it is integrated with the HTTP endpoint.
// In this schema, the query, mutation or subscriptions are defined.
// Also, for each grahpql endpoint defined in (query or mutation) a "type" also has to be defined.

// module.exports = buildSchema(`
//     type TestData{
//         text: String!
//         views: Int!
//     }

//     type RootQuery{
//         hello: TestData!
//     }

//     schema {
//         query: RootQuery
//     }`);

// The below graphql Schema is designed to create users (signin) into the application.
// For creating, updating or deleting as we know a "mutation" is used in graphql environment.
// createUser is the endpoint for which a resolver has to be defined.
// Also, in graphql environment, any endpoint can consume parameters which are defined under "input" modules.
// The return type of the createUser endpoint is an User Object.

module.exports = buildSchema(`

    type Post{
        _id: ID!
        title: String!
        imageUrl: String!
        content: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData{
        token: String!
        userId: String!
    }

    input userInputData {
        email: String!
        name: String!
        password: String!
    }

    input postInputData{
        title: String!
        content: String!
        imageUrl: String!
    }

    type PostData{
        totalPosts: Int!,
        posts: [Post!]!
    }

    type RootMutation{
        createUser(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
        updatePost(id: ID!, postInput: postInputData): Post!
    }

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        posts(page: Int!): PostData!
        getPost(postId: ID!): Post!
    }

    schema{
        query: RootQuery
        mutation: RootMutation    
    }
`);