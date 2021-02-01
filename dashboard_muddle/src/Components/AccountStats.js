import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { gql, useQuery } from "@apollo/client";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const GET_ACCOUNT_STATS = gql`
  query {
    accountStats {
      accounts
      certified
      crowns
    }
  }
`;

export default function AccountStats(props) {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_ACCOUNT_STATS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

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
        Nombre de comptes créés
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
        {data.accountStats.accounts}
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
        Comptes certifiés
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
        {data.accountStats.certified}
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
        Couronnes attribuées
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
        {data.accountStats.crowns}
      </Typography>
    </React.Fragment>
  );
}
