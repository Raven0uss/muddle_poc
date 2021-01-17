import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function DebateStats(props) {
  const classes = useStyles();
  const { debates, comments } = props;
  return (
    <React.Fragment>
      <Typography component="p" variant="h6">
        Debats
      </Typography>
      <Typography component="p" variant="h4">
        {debates}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        en ligne
      </Typography>
      <Typography component="p" variant="h6">
        Commentaires
      </Typography>
      <Typography component="p" variant="h4">
        {comments}
      </Typography>
    </React.Fragment>
  );
}
