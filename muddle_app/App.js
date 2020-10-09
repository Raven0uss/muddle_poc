import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as PaperProvider } from "react-native-paper";
import { apolloClient } from "./apollo";

import RootComponent from "./Components/Home"

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider>
        <RootComponent />
      </PaperProvider>
    </ApolloProvider>
  );
}
