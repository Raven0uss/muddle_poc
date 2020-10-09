const User = require('./connectors');

//Define your resolver
const resolvers = {
    Query: {
        users: () => User.find({}, (error, users) => {
            //If there is an errror throw the error on your graphql playground.
            if (error) throw new Error(error);
            // console.log('Users : ', users);
            
            return users;
        })
    }
}

module.exports = resolvers;