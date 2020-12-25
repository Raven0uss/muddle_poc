import React from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import SignIn from "./Components/SignIn";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#F7F7F7",
      }}
    >
      {/* <SignIn /> */}
      <Dashboard />
    </div>
  );
}

export default App;
