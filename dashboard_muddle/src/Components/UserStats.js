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
      <Typography component="p" variant="h6">
        Connexions en temps réel
      </Typography>
      <Typography component="p" variant="h4">
        {connectedToday}
      </Typography>

      <Typography component="p" variant="h6">
        Repartition
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography component="p" variant="h4">
            {repartitions.male}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography component="p" variant="h4">
            {repartitions.female}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography component="p" variant="h4">
            {repartitions.nd}%
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography color="textSecondary" className={classes.depositContext}>
            hommes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="textSecondary" className={classes.depositContext}>
            femmes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="textSecondary" className={classes.depositContext}>
            non défini
          </Typography>
        </Grid>
      </Grid>

      <Typography component="p" variant="h6">
        Age moyen
      </Typography>
      <Typography component="p" variant="h4">
        {ageAverage}
      </Typography>
    </React.Fragment>
  );
}
