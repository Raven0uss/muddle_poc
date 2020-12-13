import { split, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getItem } from "./CustomProperties/storage";
import { setContext } from "@apollo/link-context";
import { getMainDefinition } from "@apollo/client/utilities";

const GRAPHQL_API_URL = "2a8549e019ba.ngrok.io";

// asyncAuthLink will run every time request is made and use the token provided while making the request
const asyncAuthLink = setContext(async () => {
  const token = await getItem("token");
  return {
    headers: {
      token,
    },
  };
});

const httpLink = new HttpLink({
  uri: `http://${GRAPHQL_API_URL}/`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${GRAPHQL_API_URL}/`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: asyncAuthLink.concat(splitLink),
});
