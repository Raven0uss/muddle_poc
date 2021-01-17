import React from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import SignIn from "./Components/SignIn";
import Dashboard from "./Components/Dashboard";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
// import moment from "moment";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* <SignIn /> */}
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
