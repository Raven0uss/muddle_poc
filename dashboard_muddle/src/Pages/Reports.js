import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import { isNil } from "lodash";
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

const GET_REPORTS = gql`
  query($first: Int!, $skip: Int!) {
    reports(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      from {
        id
        firstname
        lastname
        email
      }
      type
      reason
      reasonText
      treated
      debate {
        id
        owner {
          id
          firstname
          lastname
          email
        }
        ownerRed {
          id
          firstname
          lastname
          email
        }
        ownerBlue {
          id
          firstname
          lastname
          email
        }
        content
        type
        closed
        answerOne
        answerTwo
        image
      }
      comment {
        id
        from {
          id
          firstname
          lastname
          email
        }
        content
      }
      createdAt
      updatedAt
    }
  }
`;

const CLOSE_DEBATE = gql`
  mutation($debateId: ID!) {
    closeMyDebate(debateId: $debateId) {
      id
    }
  }
`;

const DELETE_DEBATE = gql`
  mutation($debateId: ID!) {
    deleteMyDebate(debateId: $debateId) {
      id
    }
  }
`;

const BAN_USER = gql`
  mutation($userId: ID!) {
    deleteThisUser(userId: $userId, banned: true) {
      value
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation($commentId: ID!) {
    deleteMyComment(commentId: $commentId) {
      id
    }
  }
`;

const CANCEL_REPORT = gql`
  mutation($reportId: ID!) {
    deleteReport(where: { id: $reportId }) {
      id
    }
  }
`;

const frequency = 5;

const Reports = (props) => {
  const classes = useStyles();
  const [reports, setReports] = React.useState([]);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);

  const {
    data: reportsData,
    loading: loadingReports,
    error: errorReports,
    fetchMore,
    refetch,
  } = useQuery(GET_REPORTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: frequency,
      skip: frequency * (page - 1),
    },
    onCompleted: (response) => {
      console.log(response);
      if ("reports" in response) setReports(response.reports);
    },
  });

  const [closeDebate] = useMutation(CLOSE_DEBATE, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  const [deleteDebate] = useMutation(DELETE_DEBATE, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  const [banUser] = useMutation(BAN_USER, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  const [cancelReport] = useMutation(CANCEL_REPORT, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  const changePage = async (direction) => {
    setPage((p) => {
      const newPage = direction === "next" ? p + 1 : p - 1;
      //   const skip = frequency * (newPage - 1);
      return newPage;
    });
  };

  if (loadingReports) return <div>Chargement...</div>;
  if (errorReports) return <div>Oops, une erreur est survenue</div>;

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div
        style={{
          margin: 10,
        }}
      >
        <div>
          <h3>Signalements</h3>
          <br />
          {/* <button onClick={() => setFilterOpen((b) => !b)}>
            {filterOpen ? "Cacher les filtres" : "Afficher les filtres"}
          </button> */}
          <br />
          {/* {filterOpen && (
            <Paper
              style={{
                padding: 10,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={2}>
                  Signalements traités :{" "}
                  <select>
                    <option value="non_treated">Non</option>
                    <option value="treated">Oui</option>
                    <option value="all">Tous</option>
                  </select>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <button>Appliquer les changements</button>
                </Grid>
              </Grid>
            </Paper>
          )} */}
        </div>
        <br />
        <Grid container spacing={3} style={{ marginLeft: "auto" }}>
          <Grid item xs={12}>
            {page !== 1 && (
              <button
                onClick={() => changePage("prev")}
                disabled={loadingReports}
              >
                Page précédente
              </button>
            )}
            <span style={{ marginLeft: 5, marginRight: 5 }}>Page {page}</span>
            <button
              onClick={() => changePage("next")}
              disabled={loadingReports || reports.length === 0}
            >
              Page suivante
            </button>
          </Grid>
        </Grid>
        {reports.map((report) => (
          <Paper
            style={{
              padding: 10,
              marginTop: 10,
            }}
          >
            <div>ID: {report.id}</div>
            <div>
              Créé le :{" "}
              {moment(report.createdAt).format("dddd DD MMMM YYYY à HH[h]mm")}
            </div>
            <br />
            <div>Reporté par : </div>
            <div>{report.from.id}</div>
            <div>
              {report.from.firstname} {report.from.lastname} - (
              {report.from.email})
            </div>
            <br />
            {/* <div>Traité :{report.treated ? " Oui" : " Non"}</div> */}
            <br />
            <div>Raison : {report.reason}</div>
            <div>Explications : {report.reasonText}</div>
            <br />
            {report.type === "DEBATE" && (
              <div>
                <div>
                  Publié par :
                  {report.debate.type === "DUO"
                    ? ` ${report.debate.ownerBlue.firstname} ${report.debate.ownerBlue.lastname} (${report.debate.ownerBlue.email}) et ${report.debate.ownerRed.firstname} ${report.debate.ownerRed.lastname} (${report.debate.ownerRed.email})`
                    : ` ${report.debate.owner.firstname} ${report.debate.owner.lastname} (${report.debate.owner.email})`}
                </div>
                <br />
                <div>Contenu du débat :</div>
                <div>{report.debate.content}</div>
                <div>Réponse 1 : {report.debate.answerOne}</div>
                <div>Réponse 2 : {report.debate.answerTwo}</div>
                <br />
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <button
                      onClick={() =>
                        askSure(
                          "Êtes-vous sûr de supprimer ce débat ?",
                          async () => {
                            await deleteDebate({
                              variables: {
                                debateId: report.debate.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Supprimer le débat
                    </button>
                    <br />
                    <button
                      onClick={() =>
                        askSure(
                          "Êtes-vous sûr de clore ce débat ?",
                          async () => {
                            await closeDebate({
                              variables: {
                                debateId: report.debate.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Clore le débat
                    </button>
                  </Grid>
                  <Grid item xs={3}>
                    <button
                      onClick={() =>
                        askSure(
                          "Êtes-vous sûr de supprimer le signalement ?",
                          async () => {
                            await cancelReport({
                              variables: {
                                reportId: report.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Annuler le signalement
                    </button>
                  </Grid>
                  <Grid item xs={3}>
                    {report.debate.type === "DUO" ? (
                      <button
                        onClick={() =>
                          askSure(
                            `Êtes-vous sûr de bannir les deux utilisateurs ?`,
                            async () => {
                              await banUser({
                                variables: {
                                  userId: report.debate.ownerBlue.id,
                                },
                              });
                              await banUser({
                                variables: {
                                  userId: report.debate.ownerRed.id,
                                },
                              });
                              refetch();
                            }
                          )
                        }
                      >
                        Bannir les utilisateurs
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          askSure(
                            `Êtes-vous sûr de bannir cet utilisateur ?`,
                            async () => {
                              await banUser({
                                variables: {
                                  userId: report.debate.owner.id,
                                },
                              });
                              refetch();
                            }
                          )
                        }
                      >
                        Bannir l'utilisateur
                      </button>
                    )}
                    <br />
                  </Grid>
                </Grid>
              </div>
            )}
            {report.type === "COMMENT" && (
              <div>
                <div>
                  Publié par : {report.comment.from.firstname}{" "}
                  {report.comment.from.lastname} ({report.comment.from.email})
                </div>
                <br />
                <div>Contenu du commentaire :</div>
                <div>{report.comment.content}</div> <br />
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <button
                      onClick={() =>
                        askSure(
                          `Êtes-vous sûr de supprimer ce commentaire ?`,
                          async () => {
                            await deleteComment({
                              variables: {
                                commentId: report.comment.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Supprimer le commentaire
                    </button>
                    <br />
                  </Grid>
                  <Grid item xs={3}>
                    <button
                      onClick={() =>
                        askSure(
                          "Êtes-vous sûr de supprimer le signalement ?",
                          async () => {
                            await cancelReport({
                              variables: {
                                reportId: report.id,
                              },
                            });
                            refetch();
                          }
                        )
                      }
                    >
                      Annuler le signalement
                    </button>
                  </Grid>
                  <Grid item xs={3}>
                    <button
                      onClick={() =>
                        askSure(
                          `Êtes-vous sûr de bannir cet utilisateur ?`,
                          async () => {
                            await banUser({
                              variables: {
                                userId: report.comment.from.id,
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
              </div>
            )}
          </Paper>
        ))}
        <br />
        {reports.length !== 0 && loadingReports === false && (
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

export default Reports;
