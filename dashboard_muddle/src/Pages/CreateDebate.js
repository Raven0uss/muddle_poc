import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { isEmpty } from "lodash";

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: "#f5f5f5",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    margin: 0,
    // backgroundColor: "#FFF",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    // overflow: "auto",
    flexDirection: "column",
    boxShadow: "inherit !important",
    borderWidth: 0,
  },
  fixedHeight: {
    height: 300,
  },
}));

const CREATE_DEBATE = gql`
  mutation(
    $days: String!
    $hours: String!
    $content: String!
    $image: String
    $answerOne: String!
    $answerTwo: String
  ) {
    createGeneratedDebate(
      days: $days
      hours: $hours
      content: $content
      image: $image
      answerOne: $answerOne
      answerTwo: $answerTwo
    ) {
      id
    }
  }
`;

const CreateDebate = (props) => {
  const [debate, setDebate] = React.useState({
    content: "",
    days: "0d",
    hours: "1h",
    image: "",
    answerOne: "",
    answerTwo: "",
  });
  const classes = useStyles();

  const [createGeneratedDebate] = useMutation(CREATE_DEBATE, {
    onCompleted: () => {
      setDebate({
        content: "",
        days: "0d",
        hours: "1h",
        image: "",
        answerOne: "",
        answerTwo: "",
      });
    },
  });

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7} xl={5}>
          <Paper
            style={{
              margin: 20,
              padding: 20,
            }}
          >
            <h4>Nouveau débat généré</h4>
            <br />
            <div>
              Durée du débat -{" "}
              <select
                value={debate.days}
                onChange={(e) =>
                  setDebate((d) => ({
                    ...d,
                    days: e.target.value,
                  }))
                }
              >
                <option value="0d">0 jour</option>
                <option value="1d">1 jour</option>
                <option value="2d">2 jours</option>
                <option value="3d">3 jours</option>
                <option value="4d">4 jours</option>
                <option value="5d">5 jours</option>
                <option value="6d">6 jours</option>
                <option value="7d">7 jours</option>
                <option value="8d">8 jours</option>
                <option value="9d">9 jours</option>
              </select>
              <select
                value={debate.hours}
                onChange={(e) =>
                  setDebate((d) => ({
                    ...d,
                    hours: e.target.value,
                  }))
                }
              >
                <option value="1h">1 heure</option>
                <option value="2h">2 heures</option>
                <option value="3h">3 heures</option>
                <option value="4h">4 heures</option>
                <option value="5h">5 heures</option>
                <option value="6h">6 heures</option>
                <option value="7h">7 heures</option>
                <option value="8h">8 heures</option>
                <option value="9h">9 heures</option>
                <option value="10h">10 heures</option>
                <option value="11h">11 heures</option>
                <option value="12h">12 heures</option>
                <option value="13h">13 heures</option>
                <option value="14h">14 heures</option>
                <option value="15h">15 heures</option>
                <option value="16h">16 heures</option>
                <option value="17h">17 heures</option>
                <option value="18h">18 heures</option>
                <option value="19h">19 heures</option>
                <option value="20h">20 heures</option>
                <option value="21h">21 heures</option>
                <option value="22h">22 heures</option>
                <option value="23h">23 heures</option>
              </select>
            </div>
            <div>
              Description du débat :
              <textarea
                value={debate.content}
                onChange={(e) =>
                  setDebate((d) => ({
                    ...d,
                    content: e.target.value,
                  }))
                }
                style={{
                  resize: "none",
                  width: "100%",
                  height: 100,
                }}
              ></textarea>
            </div>
            <div>
              <input
                placeholder="Lien de l'image"
                value={debate.image}
                onChange={(e) =>
                  setDebate((d) => ({
                    ...d,
                    image: e.target.value,
                  }))
                }
              />{" "}
              - <i>Laisser vide s'il n'y a pas d'images</i>
            </div>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <input
                  placeholder="Choix 1"
                  style={{ width: "100%" }}
                  value={debate.answerOne}
                  onChange={(e) =>
                    setDebate((d) => ({
                      ...d,
                      answerOne: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <input
                  placeholder="Choix 2"
                  style={{ width: "100%" }}
                  value={debate.answerTwo}
                  onChange={(e) =>
                    setDebate((d) => ({
                      ...d,
                      answerTwo: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
            <br />
            <button
              onClick={async () => {
                await createGeneratedDebate({ variables: debate });
              }}
              disabled={
                isEmpty(debate.content) ||
                isEmpty(debate.answerOne) ||
                isEmpty(debate.answerTwo)
              }
            >
              Publier le débat généré
            </button>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default CreateDebate;
