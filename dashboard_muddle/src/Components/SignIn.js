import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { get } from "lodash";
import logoMenu from "../logo_menu.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://muddles.fr/">
        Muddles
      </Link>{" "}
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

const LOG_IN = gql`
  mutation($email: String!, $password: String!) {
    signInDashboard(email: $email, password: $password) {
      token
    }
  }
`;

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState(false);

  const history = useHistory();
  const classes = useStyles();

  const [logIn] = useMutation(LOG_IN, {
    onCompleted: (response) => {
      const token = get(response, "signInDashboard.token", "0");

      if (token === "0") {
        setError(true);
        return;
      }
      localStorage.setItem("token", token);
      history.replace("/dashboard");
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem("token")) history.replace("/dashboard");
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: "50%",
        }}
      >
        <div>
          <img src={logoMenu} style={{ width: 300 }} />
          <b>Professionel</b>
        </div>
        <TextField
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
          }}
          variant="filled"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adresse mail"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          name="password"
          label="Mot de passe"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={async (e) => {
            setError(false);
            console.log(e.key);
            if (e.key === "Enter")
              await logIn({
                variables: {
                  email,
                  password,
                },
              });
          }}
        />
        {error && <p style={{ color: "red" }}>Identifiants incorrects</p>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={async () => {
            setError(false);
            await logIn({
              variables: {
                email,
                password,
              },
            });
          }}
        >
          Se connecter
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
