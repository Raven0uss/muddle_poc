const { gql } = require('apollo-server');

// Define your type definitions
const typeDefs = gql`
    type Query {
        users: [User]
    }

    type User {
        username: String
        password: String
        email: String
    }

    schema {
        query: Query
    }
`;

//Export your type definitions as a default export 
module.exports = typeDefs;