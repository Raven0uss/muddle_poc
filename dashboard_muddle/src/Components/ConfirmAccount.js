import { gql, useMutation } from "@apollo/client";
import { get, isEmpty, isNil } from "lodash";
import React from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";

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
      <>
        <div>En cours de validation...</div>
      </>
    );
  }
  if (success === false) {
    return (
      <>
        <div>Token invalide</div>
      </>
    );
  }
  return (
    <>
      <div>Votre compte a été validé avec succès !</div>
      <div>Your account has been validated with success !</div>
    </>
  );
};

export default ConfirmAccount;
