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

function ForgotPassword() {
  let queryParams = useQueryParams();
  const token = queryParams.get("token");
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
          name="newPassword"
          id="newPassword"
          label="Nouveau mot de passe / New password"
          type="password"
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
          name="newPassword"
          id="newPassword"
          label="Confirmer nouveau mot de passe / Confirm new password"
          type="password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sauvegarder / Save
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default ForgotPassword;
