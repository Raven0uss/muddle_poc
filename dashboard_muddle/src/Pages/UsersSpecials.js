import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
import { get } from "lodash";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import askSure from "../askSure";

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
    users(where: { role_not: STANDARD }, first: $first, skip: $skip) {
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

const BLOCK_MAIL = gql`
  mutation($userId: ID!) {
    updateUser(where: { id: $userId }, data: { mailStatus: BLOCKED }) {
      id
    }
  }
`;

const UNBLOCK_MAIL = gql`
  mutation($userId: ID!) {
    updateUser(where: { id: $userId }, data: { mailStatus: HEALTHY }) {
      id
    }
  }
`;

const DELETE_USER = gql`
  mutation($userId: ID!) {
    deleteThisUser(userId: $userId, banned: false) {
      value
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation($newPassword: String!, $userId: ID!) {
    changePassword(userId: $userId, newPassword: $newPassword) {
      value
    }
  }
`;

const frequency = 10;

const SpecialUsers = (props) => {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  const [page, setPage] = React.useState(1);

  const { loading, error, fetchMore, refetch } = useQuery(GET_USERS, {
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

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [blockMail] = useMutation(BLOCK_MAIL, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [unblockMail] = useMutation(UNBLOCK_MAIL, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div
        style={{
          margin: 10,
        }}
      >
        <h3>Utilisateurs Spéciaux</h3>
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
        <p id="new_password"></p>
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
                  Role : {user.role}
                </Grid>
                <Grid item xs={3}>
                  Email : {user.email}
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
                  {user.mailStatus === "HEALTHY" ? (
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous bloquer les mails pour cet utilisateur ? ",
                          async () => {
                            await blockMail({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Bloquer les mails
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous autoriser les mails pour cet utilisateur ? ",
                          async () => {
                            await unblockMail({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Débloquer les mails
                    </button>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <button
                    onClick={() =>
                      askSure(
                        "Voulez-vous supprimer cet utilisateur ? ",
                        async () => {
                          await deleteUser({
                            variables: {
                              userId: user.id,
                            },
                          });
                          refetch();
                        }
                      )
                    }
                  >
                    Supprimer l'utilisateur
                  </button>
                </Grid>
                <Grid item xs={3}>
                  <button
                    onClick={async () => {
                      var password = prompt("Entrez le nouveau mot de passe");
                      if (password !== null)
                        await changePassword({
                          variables: { newPassword: password, userId: user.id },
                        });
                    }}
                  >
                    Changer le mot de passe
                  </button>
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

export default SpecialUsers;
