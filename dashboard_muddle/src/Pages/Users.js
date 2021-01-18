import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useQuery } from "@apollo/client";
import { get } from "lodash";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import AccountStats from "../Components/AccountStats";

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

const GET_USERS = gql`
  query($first: Int!, $skip: Int!) {
    users(where: { role: STANDARD }, first: $first, skip: $skip) {
      id
      firstname
      lastname
      email
      birthdate
      role
      gender
      certified
      profilePicture
      crowned
      private
      debates {
        id
      }
      trophies {
        id
      }
      mailStatus
      followers {
        id
      }
      following {
        id
      }
      blocked {
        id
      }
      blocking {
        id
      }
      createdAt
    }
  }
`;

const frequency = 10;

const Users = (props) => {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  const [page, setPage] = React.useState(1);

  const { loading, error, fetchMore } = useQuery(GET_USERS, {
    variables: {
      first: frequency,
      skip: frequency * (page - 1),
    },
    onCompleted: (response) => {
      const usersQuery = get(response, "users", []);

      setUsers(usersQuery);
    },
    fetchPolicy: "cache-and-network",
  });

  const changePage = async (direction) => {
    setPage((p) => {
      const newPage = direction === "next" ? p + 1 : p - 1;
      //   const skip = frequency * (newPage - 1);
      return newPage;
    });
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div
        style={{
          margin: 10,
        }}
      >
        <h3>Utilisateurs</h3>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper>Filtres</Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                style={{
                  padding: 10,
                  borderRadius: 14,
                }}
              >
                <AccountStats />
              </Paper>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={3} style={{ marginLeft: "auto" }}>
          <Grid item xs={12}>
            {page !== 1 && (
              <button onClick={() => changePage("prev")} disabled={loading}>
                Page précédente
              </button>
            )}
            <span style={{ marginLeft: 5, marginRight: 5 }}>Page {page}</span>
            <button
              onClick={() => changePage("next")}
              disabled={loading || users.length === 0}
            >
              Page suivante
            </button>
          </Grid>
        </Grid>
        {users.map((user) => {
          return (
            <Paper
              style={{
                padding: 10,
                marginTop: 10,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  ID: {user.id}
                </Grid>
                <Grid item xs={3}>
                  Prénom : {user.firstname}
                </Grid>
                <Grid item xs={3}>
                  Nom : {user.lastname}
                </Grid>
                <Grid item xs={3}>
                  Date de naissance :{" "}
                  {moment(user.birthdate).format("dddd DD MMMM YYYY")}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <img
                    src={user.profilePicture}
                    alt="profile_picture"
                    height={100}
                  />
                </Grid>
                <Grid item xs={3}>
                  Genre : {user.gender}
                </Grid>
                <Grid item xs={3}>
                  Role : {user.role}
                </Grid>
                <Grid item xs={3}>
                  Certifié : {user.certified ? "Oui" : "Non"}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  Couronne: {user.crowned ? "Oui" : "Non"}
                </Grid>
                <Grid item xs={3}>
                  Privé : {user.private ? "Oui" : "Non"}
                </Grid>
                {user.crowned &&
                  `Couronne disponible jusqu'à ${moment(
                    user.crownedDate
                  ).format("ddd DD MMM YYYY")}`}
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  Débats : {user.debates.length}
                </Grid>
                <Grid item xs={3}>
                  Trophés: {user.trophies.length}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  Followers : {user.followers.length}
                </Grid>
                <Grid item xs={3}>
                  Following : {user.following.length}
                </Grid>
                <Grid item xs={3}>
                  Bloqué : {user.blocked.length}
                </Grid>
                <Grid item xs={3}>
                  Bloqué par : {user.blocking.length}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  Inscrit depuis : {moment(user.created).format("DD MMM YYYY")}
                </Grid>
                <Grid item xs={3}>
                  Mails Status : {user.mailStatus}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  {user.certified === false ? (
                    <button>Donner la certification</button>
                  ) : (
                    <button>Enlever la certification</button>
                  )}
                  {user.crowned === false ? (
                    <button>Donner la couronne</button>
                  ) : (
                    <button>Enlever la couronne</button>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {user.mailStatus === "HEALTHY" ? (
                    <button>Bloquer les mails</button>
                  ) : (
                    <button>Débloquer les mails</button>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <button>Bannir l'utilisateur</button>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
        {users.length !== 0 && loading === false && (
          <Grid container spacing={3} style={{ marginLeft: "auto" }}>
            <Grid item xs={12}>
              {page !== 1 && (
                <button onClick={() => changePage("prev")}>
                  Page précédente
                </button>
              )}
              <span style={{ marginLeft: 5, marginRight: 5 }}>Page {page}</span>
              <button onClick={() => changePage("next")}>Page suivante</button>
            </Grid>
          </Grid>
        )}
      </div>
    </main>
  );
};

export default Users;
