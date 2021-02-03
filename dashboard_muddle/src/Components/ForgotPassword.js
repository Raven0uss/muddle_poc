import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import LinkTypo from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { get, isEmpty, isNil } from "lodash";
import logoMenu from "../logo_menu.png";

const checkPasswordStrong = (password) => {
  if (password.search(/\d/) === -1)
    return {
      error: true,
      message: "Votre nouveau mot de passe doit contenir au moins un chiffre.",
    };
  if (password.search(/[a-zA-Z]/) === -1)
    return {
      error: true,
      message: "Votre nouveau mot de passe doit contenir au moins une lettre.",
    };
  return null;
};

const checkPassword = (password, confirmPassword) => {
  if (password.length < 8 || password.length > 30) {
    return {
      error: true,
      message: "Votre nouveau mot de passe doit faire au moins 8 caractères.",
    };
  }
  if (password.length > 30) {
    return {
      error: true,
      message: "Votre nouveau mot de passe ne peut pas excéder 30 caractères.",
    };
  }
  const strong = checkPasswordStrong(password);
  if (strong !== null) {
    return strong;
  }
  if (password !== confirmPassword) {
    return {
      error: true,
      message: "Les mots de passe saisis ne correspondent pas.",
    };
  }
  return {
    error: false,
  };
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <LinkTypo color="inherit" href="https://muddles.fr/">
        Muddles
      </LinkTypo>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#222222",
    padding: 30,
    // width: "200%",
    borderRadius: 40,
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: "#d7d7d7",
    boxShadow: "4px 3px 4px #00000045",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#F47658",
    "&:hover": {
      backgroundColor: "#F47658dd",
    },
    padding: 10,
    width: "50%",
    marginLeft: "auto",
  },
}));

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const CHECK_TOKEN_FORGOT_PASSWORD = gql`
  mutation($token: String!) {
    checkTokenForgotPassword(token: $token) {
      id
      email
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation($userId: ID!, $newPassword: String!) {
    changePassword(userId: $userId, newPassword: $newPassword) {
      value
    }
  }
`;

function ForgotPassword() {
  let queryParams = useQueryParams();
  const token = queryParams.get("token");
  const classes = useStyles();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const [userId, setUserId] = React.useState(0);

  const [errorPage, setErrorPage] = React.useState(false);
  const [successPage, setSuccessPage] = React.useState(false);

  const [
    checkTokenForgotPassword,
    { loading: loadingCheckToken },
  ] = useMutation(CHECK_TOKEN_FORGOT_PASSWORD, {
    onCompleted: (response) => {
      const id = get(response, "checkTokenForgotPassword.id", "0");
      if (id === "0") {
        setErrorPage(true);
        return;
      }
      setUserId(id);
    },
    onError: () => {
      setErrorPage(true);
    },
    variables: {
      token,
    },
  });

  const [changePassword, { loading: loadingChange }] = useMutation(
    CHANGE_PASSWORD,
    {
      onCompleted: (response) => {
        const value = get(response, "changePassword.value");
        if (value !== 0) {
          setErrorPage(true);
          return;
        }
        setSuccessPage(true);
      },
      onError: () => {
        setErrorPage(true);
      },
    }
  );

  React.useEffect(() => {
    const execReq = async () => {
      console.log("yes");
      await checkTokenForgotPassword();
    };

    if (isNil(token) || isEmpty(token)) {
      setErrorPage(true);
      return;
    }

    execReq();
  }, []);

  if (errorPage) {
    return (
      <Container component="main" maxWidth="xs">
        <div
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: "50%",
          }}
        >
          <img src={logoMenu} style={{ width: 300 }} />
          <h3>Oops, ce lien n'est pas valide ! 🥺</h3>
        </div>
      </Container>
    );
  }
  if (successPage) {
    return (
      <Container component="main" maxWidth="xs">
        <div
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: "50%",
          }}
        >
          <img src={logoMenu} style={{ width: 300 }} />
          <h3 style={{ color: "green" }}>
            Votre mot de passe a été modifié avec succès ! 👌
          </h3>
        </div>
      </Container>
    );
  }
  if (loadingCheckToken || loadingChange) {
    return (
      <Container component="main" maxWidth="xs">
        <div
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: "50%",
          }}
        >
          <img src={logoMenu} style={{ width: 300 }} />
          <h3>Chargement... 🤔</h3>
        </div>
      </Container>
    );
  }
  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: "50%",
        }}
      >
        <img src={logoMenu} style={{ width: 300 }} />
        <TextField
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
          }}
          variant="filled"
          margin="normal"
          required
          fullWidth
          name="newPassword-forgot"
          id="newPassword-forgot"
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
          }}
          variant="filled"
          margin="normal"
          required
          fullWidth
          name="newPasswordConfirm-forgot"
          id="newPasswordConfirm-forgot"
          label="Confirmer nouveau mot de passe"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={async () => {
            const checkError = checkPassword(newPassword, confirmNewPassword);
            if (checkError.error) {
              console.log(checkError);
              console.log(checkError.message);
              alert(checkError.message);
            } else {
              await changePassword({
                variables: {
                  newPassword,
                  userId,
                },
              });
            }
          }}
        >
          Confirmer
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default ForgotPassword;
