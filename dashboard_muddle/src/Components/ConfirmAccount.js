import { gql, useMutation } from "@apollo/client";
import { get, isEmpty, isNil } from "lodash";
import React from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import logoMenu from "../logo_menu.png";

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const VALIDATE_USER = gql`
  mutation($token: String!) {
    validateUser(token: $token) {
      id
    }
  }
`;

const ConfirmAccount = () => {
  let queryParams = useQueryParams();
  const token = queryParams.get("token");
  const [success, setSuccess] = React.useState(false);
  const [validateUser, { loading }] = useMutation(VALIDATE_USER, {
    variables: {
      token,
    },
    onCompleted: (response) => {
      const user = get(response, "validateUser.id");
      if (isNil(user)) {
        setSuccess(false);
        return;
      }
      setSuccess(true);
    },
    onError: () => {
      setSuccess(false);
    },
  });

  React.useEffect(() => {
    const execReq = async () => {
      await validateUser();
    };
    if (isNil(token) || isEmpty(token)) {
      setSuccess(false);
      return;
    }
    execReq();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <img src={logoMenu} style={{ width: 300, marginBottom: 50 }} />

        <h3>Chargement... 🤔</h3>
      </div>
    );
  }
  if (success === false) {
    return (
      <div
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <img src={logoMenu} style={{ width: 300, marginBottom: 50 }} />

        <h3>Oops, ce lien n'est pas valide ! 🥺</h3>
      </div>
    );
  }
  return (
    <div
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <img src={logoMenu} style={{ width: 300, marginBottom: 50 }} />

      <h3 style={{ color: "green" }}>
        Votre compte a été validé avec succès ! 😉
      </h3>
    </div>
  );
};

export default ConfirmAccount;
