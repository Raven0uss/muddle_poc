import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useQuery } from "@apollo/client";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import { isNil } from "lodash";

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

const GET_REPORTS = gql`
  query {
    reports(orderBy: createdAt_DESC) {
      id
    }
  }
`;

const Reports = (props) => {
  const classes = useStyles();

  const {
    data: reportsData,
    loading: loadingReports,
    error: errorReports,
  } = useQuery(GET_REPORTS);

  if (loadingReports) return <div>Chargement...</div>;
  if (errorReports) return <div>Oops, une erreur est survenue</div>;
  const { reports } = reportsData;

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
    </main>
  );
};

export default Reports;
