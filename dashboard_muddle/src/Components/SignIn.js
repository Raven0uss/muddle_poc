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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
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

export default function SignIn() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          flex: 1,
          alignItems: "center",
          marginTop: "50%",
        }}
      >
        <Typography>Muddles</Typography>
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
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
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
