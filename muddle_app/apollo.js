import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getItem } from "./CustomProperties/storage";
import { setContext } from "@apollo/link-context";

const GRAPHQL_API_URL = "http://cbcc2284c2e6.ngrok.io/";

// uncomment the code below in case you are using a GraphQL API that requires some form of
// authentication. asyncAuthLink will run every time your request is made and use the token
// you provide while making the request.

// const TOKEN = ;
const asyncAuthLink = setContext(async () => {
  const token = await getItem("token");
  return {
    headers: {
      // token: ,
      token,
      // Authorization: TOKEN,
    },
  };
});

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  // link: httpLink,
  link: asyncAuthLink.concat(httpLink),
});
