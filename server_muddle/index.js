require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const PORT = 4000;

const server = new ApolloServer({ resolvers, typeDefs })

//Now listen on your server.
server.listen({port: PORT}).then(({url}) => console.log('Listening on ' + url));