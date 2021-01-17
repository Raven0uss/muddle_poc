import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ProfileIcon from "@material-ui/icons/AccountBox";
import Chart from "../Components/Chart";
import DebateStats from "../Components/DebateStats";
import UserStats from "../Components/UserStats";
import Orders from "../Components/Orders";
import { gql, useQuery } from "@apollo/client";

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
    borderRadius: 14,
  },
  fixedHeight: {
    height: 450,
  },
}));

const GET_MAIN_STATS = gql`
  query {
    mainStats {
      debates
      comments
      malePercentage
      femalePercentage
      notDefinedPercentage
      ageAverage
      connectedToday
    }
  }
`;

const Home = (props) => {
  const { data, loading, error } = useQuery(GET_MAIN_STATS, {
    onCompleted: (result) => {
      //   console.log(result);
    },
    fetchPolicy: "cache-and-network",
  });
  //   console.log(data);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  if (loading || data === undefined)
    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        Chargement...
      </main>
    );
  if (error) return <div>Oops, une erreur est survenue</div>;
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {/* Debate Stats */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper className={classes.paper}>
              <DebateStats
                debates={data.mainStats.debates}
                comments={data.mainStats.comments}
              />
            </Paper>
          </Grid>
          {/* User Stats */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper className={classes.paper}>
              <UserStats
                repartitions={{
                  male: data.mainStats.malePercentage,
                  female: data.mainStats.femalePercentage,
                  nd: data.mainStats.notDefinedPercentage,
                }}
                ageAverage={data.mainStats.ageAverage}
                connectedToday={data.mainStats.connectedToday}
              />
            </Paper>
          </Grid>
          {/* Connexions Stats Charts */}
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <Chart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Home;
