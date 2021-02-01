import React from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import SignIn from "./Components/SignIn";
import Dashboard from "./Components/Dashboard";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ConfirmAccount from "./Components/ConfirmAccount";
import ForgotPassword from "./Components/ForgotPassword";

// import moment from "moment";
require("typeface-montserrat");

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
        <BrowserRouter>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>

            <Route path="/confirm">
              <ConfirmAccount />
            </Route>
            <Route path="/forgot">
              <ForgotPassword />
            </Route>
            <Route path="/">
              <SignIn />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
