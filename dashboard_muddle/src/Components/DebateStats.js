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
      <Typography
        component="p"
        variant="h6"
        style={{
          fontFamily: "Montserrat",
          fontSize: 12,
        }}
      >
        Débats
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
        {debates}
      </Typography>
      <Typography
        color="textSecondary"
        className={classes.depositContext}
        style={{
          fontFamily: "Montserrat",
          fontSize: 12,
        }}
      >
        en ligne
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
        Commentaires
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
        {comments}
      </Typography>
    </React.Fragment>
  );
}
