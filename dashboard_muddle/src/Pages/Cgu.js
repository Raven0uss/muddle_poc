import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logoMenu from "../logo_menu.png";
import Typography from "@material-ui/core/Typography";

import Cgufr from "../Documents/cgu-fr.pdf";
import Cguen from "../Documents/cgu-en.pdf";
import Mentionsfr from "../Documents/mentions-fr.pdf";
import Mentionsen from "../Documents/mentions-en.pdf";
import Privacyfr from "../Documents/privacy-fr.pdf";
import Privacyen from "../Documents/privacy-en.pdf";

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

export default function Documents() {
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
        <div>
          <img src={logoMenu} style={{ width: 250 }} />
        </div>
        <h3>Documents</h3>
        <div>
          <h4>Français</h4>
          <a href={Cgufr} target="_blank">
            CGU
          </a>
          {" - "}
          <a href={Mentionsfr} target="_blank">
            Mentions Légales
          </a>
          {" - "}
          <a href={Privacyfr} target="_blank">
            Confidentialité des votes
          </a>
        </div>
        <div>
          <h4>English</h4>
          <a href={Cguen} target="_blank">
            CGU
          </a>
          {" - "}
          <a href={Mentionsen} target="_blank">
            Legals Mentions
          </a>
          {" - "}
          <a href={Privacyen} target="_blank">
            Votes Privacy
          </a>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
