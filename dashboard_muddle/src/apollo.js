import { split, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
// import { WebSocketLink } from "@apollo/client/link/ws";
// import { getItem } from "./CustomProperties/storage";
import { setContext } from "@apollo/link-context";
import { getMainDefinition } from "@apollo/client/utilities";

export const GRAPHQL_API_URL = "52.47.56.241:4000";

const customFetch = (uri, options) => {
  return fetch(uri, options).then((response) => {
    if (response.status >= 400) {
      // or handle 500 errors
      if (response.status === 429) {
        console.log("Too many request ngrok.");
      } else {
        try {
          console.log(JSON.stringify(response));
          if (response.headers.map["content-type"] === "application/json")
            return response;
        } catch (err) {
          console.log(JSON.stringify(response));
        }
      }
      // alert();
      // console.log(response.status);
      return Promise.reject(response.status);
    }
    return response;
  });
};

// asyncAuthLink will run every time request is made and use the token provided while making the request
const asyncAuthLink = setContext(async () => {
  //   const token = await getItem("token");
  return {
    headers: {
      // "content-type": "application/json",
      // token: 3,
    },
  };
});

const httpLink = new HttpLink({
  uri: `http://${GRAPHQL_API_URL}/`,
  // useGETForQueries: false,
  fetch: customFetch,
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  // ssrMode: false,
  link: httpLink,
});
