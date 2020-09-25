import { ApolloServer, PubSub, gql } from "apollo-server";
const pubsub = new PubSub();

const posts = [
  {
    author: "Nelson",
    comment: "Hello",
  },
  {
    author: "Steve",
    comment: "Hello GraphQL",
  },
];

const typeDefs = gql`
  type Subscription {
    postAdded: Post
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String
    comment: String
  }
`;
const POST_ADDED = "POST_ADDED";

const resolvers = {
  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    posts() {
      return posts
    },
  },
  Mutation: {
    addPost(_, args) {
      pubsub.publish(POST_ADDED, { postAdded: args });
      posts.push(args)
      return args
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
