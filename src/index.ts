import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at open http://localhost:4000 to test the queries
  `);
});
