import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
import { get } from "lodash";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import AccountStats from "../Components/AccountStats";
import askSure from "../askSure";
import getUsers from "../gql/getUsers";

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

const BAN_USER = gql`
  mutation($userId: ID!) {
    deleteThisUser(userId: $userId, banned: true) {
      value
    }
  }
`;

const CERTIF_USER = gql`
  mutation($userId: ID!) {
    updateUser(where: { id: $userId }, data: { certified: true }) {
      id
    }
  }
`;

const REMOVE_CERTIF = gql`
  mutation($userId: ID!) {
    updateUser(where: { id: $userId }, data: { certified: false }) {
      id
    }
  }
`;

const CROWN_USER = gql`
  mutation($userId: ID!) {
    giveCrown(userId: $userId) {
      id
    }
  }
`;

const REMOVE_CROWN = gql`
  mutation($userId: ID!) {
    updateUser(
      where: { id: $userId }
      data: { crowned: false, crownedDate: null }
    ) {
      id
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

const frequency = 10;

const Users = (props) => {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  const [page, setPage] = React.useState(1);

  const [search, setSearch] = React.useState("");
  const [searchFilter, setSearchFilter] = React.useState("email");

  const { loading, error, fetchMore, refetch } = useQuery(
    getUsers(searchFilter),
    {
      variables: {
        first: frequency,
        skip: frequency * (page - 1),
        search,
      },
      onCompleted: (response) => {
        const usersQuery = get(response, "users", []);
        setUsers(usersQuery);
      },
      fetchPolicy: "no-cache",
    }
  );

  const changePage = async (direction) => {
    setPage((p) => {
      const newPage = direction === "next" ? p + 1 : p - 1;
      //   const skip = frequency * (newPage - 1);
      return newPage;
    });
  };

  const [banUser] = useMutation(BAN_USER, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [certifUser] = useMutation(CERTIF_USER, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [removeCertif] = useMutation(REMOVE_CERTIF, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [crownUser] = useMutation(CROWN_USER, {
    onCompleted: () => {
      setPage((page) => page + 1);
      setPage((page) => page - 1);
    },
  });
  const [removeCrown] = useMutation(REMOVE_CROWN, {
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
              <Paper
                style={{
                  padding: 10,
                  borderRadius: 14,
                }}
              >
                <h4>Filtres</h4>
                {/* <Grid container spacing={3}>
                  <Grid item xs={12}>
                    Afficher :{" "}
                    <select>
                      <option value="all">Tous</option>
                      <option value="crown">Couronnes</option>
                      <option value="certified">Certifiés</option>
                      <option value="emailBlocked">Emails bloqués</option>
                    </select>
                  </Grid>
                </Grid> */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    Rechercher :{" "}
                    <select onChange={(e) => setSearchFilter(e.target.value)}>
                      <option value="email">Email contient</option>
                      <option value="firstname">Prénom</option>
                      <option value="lastname">Nom</option>
                    </select>{" "}
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Votre recherche..."
                    ></input>{" "}
                  </Grid>
                </Grid>
              </Paper>
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
                  Email : {user.email}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  Certifié : {user.certified ? "Oui" : "Non"}
                </Grid>
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
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous certifier cet utilisateur ? ",
                          async () => {
                            await certifUser({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Donner la certification
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous enlever la certification de cet utilisateur ? ",
                          async () => {
                            await removeCertif({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Enlever la certification
                    </button>
                  )}
                  {user.crowned === false ? (
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous donner la couronne à cet utilisateur ? ",
                          async () => {
                            await crownUser({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Donner la couronne
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        askSure(
                          "Voulez-vous retirer la couronne à cet utilisateur ? ",
                          async () => {
                            await removeCrown({
                              variables: {
                                userId: user.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Enlever la couronne
                    </button>
                  )}
                </Grid>
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
                        "Voulez-vous bannir cet utilisateur ? ",
                        async () => {
                          await banUser({
                            variables: {
                              userId: user.id,
                            },
                          });
                          refetch();
                        }
                      )
                    }
                  >
                    Bannir l'utilisateur
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

export default Users;
