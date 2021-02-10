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

export default function Support() {
  const [language, setLanguage] = React.useState("fr");
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
        <h3>Support</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
        <br />
        <br />
        {language === "fr" && (
          <div>
            Pour toutes questions relatives à Muddles ou pour obtenir de l'aide
            merci de contacter notre support par e-mail :{" "}
            <a href="mailto:contact@muddles.fr">contact@muddles.fr</a>
          </div>
        )}
        {language === "en" && (
          <div>
            For questions about Muddles or to get help please contact our
            support by e-mail:{" "}
            <a href="mailto:contact@muddles.fr">contact@muddles.fr</a>
          </div>
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
