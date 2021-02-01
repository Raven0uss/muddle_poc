import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { Grid } from "@material-ui/core";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function UserStats(props) {
  const classes = useStyles();

  const { repartitions, ageAverage, connectedToday } = props;

  return (
    <React.Fragment>
      <Typography
        component="p"
        variant="h6"
        style={{
          fontFamily: "Montserrat",
          fontSize: 12,
        }}
      >
        Connexions aujourd'hui
      </Typography>
      <Typography
        component="p"
        variant="h4"
        style={{
          fontFamily: "Montserrat",
          fontSize: 22,
          fontWeight: "600",
        }}
      >
        {connectedToday}
      </Typography>
      <hr
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#ececec",
          width: "100%",
        }}
      />
      <Typography
        component="p"
        variant="h6"
        style={{
          fontFamily: "Montserrat",
          fontSize: 12,
        }}
      >
        Répartition
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography
            component="p"
            variant="h4"
            style={{
              fontFamily: "Montserrat",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            {repartitions.male}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            component="p"
            variant="h4"
            style={{
              fontFamily: "Montserrat",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            {repartitions.female}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            component="p"
            variant="h4"
            style={{
              fontFamily: "Montserrat",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            {repartitions.nd}%
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography
            color="textSecondary"
            className={classes.depositContext}
            style={{
              fontFamily: "Montserrat",
              fontSize: 12,
            }}
          >
            hommes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            color="textSecondary"
            className={classes.depositContext}
            style={{
              fontFamily: "Montserrat",
              fontSize: 12,
            }}
          >
            femmes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            color="textSecondary"
            className={classes.depositContext}
            style={{
              fontFamily: "Montserrat",
              fontSize: 12,
            }}
          >
            non défini
          </Typography>
        </Grid>
      </Grid>
      <hr
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#ececec",
          width: "100%",
        }}
      />
      <Typography
        component="p"
        variant="h6"
        style={{
          fontFamily: "Montserrat",
          fontSize: 12,
        }}
      >
        Age moyen
      </Typography>
      <Typography
        component="p"
        variant="h4"
        style={{
          fontFamily: "Montserrat",
          fontSize: 22,
          fontWeight: "600",
        }}
      >
        {ageAverage} ans
      </Typography>
    </React.Fragment>
  );
}
