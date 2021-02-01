import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import { isNil, get, cloneDeep } from "lodash";
import askSure from "../askSure";
import getDebates from "../gql/getDebates";

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "hidden",
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

const defineStatus = (debate) => {
  if (debate.closed === true) return "Terminé";
  if (debate.published === false) return "En attente de publication";
  return `En cours${
    isNil(debate.timelimit)
      ? ""
      : `\nFermeture du débat le ${moment(debate.timelimit).format(
          "DD MMM YYYY à hh:mm"
        )}`
  }`;
};

const getDebateType = (type) => {
  switch (type) {
    case "DUO":
      return "Débat en duo";
    case "MUDDLE":
      return "Débat généré";
    case "STANDARD":
      return "Débat standard";
    default:
      break;
  }
};

const frequency = 5;

const defaultFilter = {
  status: "all",
  type: "all",
  reports: "all",
  order: "createdAt_DESC",
};

const Debates = (props) => {
  const classes = useStyles();

  const [debates, setDebates] = React.useState([]);

  const [comments, setComments] = React.useState(null);
  const [reports, setReports] = React.useState(null);

  const [page, setPage] = React.useState(1);

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterCommentOpen, setFilterCommentOpen] = React.useState(false);
  // const [filterReportOpen, setFilterReportOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filterSearch, setFilterSearch] = React.useState("content");
  // const [orderBy, setOrderBy] = React.useState("content");

  const {
    data: debatesData,
    loading: loadingDebates,
    error: errorDebates,
    fetchMore,
    refetch,
  } = useQuery(getDebates(filterSearch), {
    variables: {
      first: frequency,
      skip: frequency * (page - 1),
      search,
    },
    onCompleted: (response) => {
      const debatesQuery = get(response, "debates", []);
      setDebates(debatesQuery);
    },
    fetchPolicy: "cache-and-network",
  });

  const [closeDebate] = useMutation(CLOSE_DEBATE, {
    onCompleted: () => {
      // refetch();
      setComments(null);
      setReports(null);
    },
  });

  const [deleteDebate] = useMutation(DELETE_DEBATE, {
    onCompleted: () => {
      setComments(null);
      setReports(null);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      // setComments(null);
      setReports(null);
    },
  });

  const [banUser] = useMutation(BAN_USER, {
    onCompleted: () => {
      setComments(null);
      setReports(null);
    },
  });

  const [cancelReport] = useMutation(CANCEL_REPORT, {
    onCompleted: () => {
      setComments(null);
      setReports(null);
    },
  });

  const changePage = async (direction) => {
    setPage((p) => {
      const newPage = direction === "next" ? p + 1 : p - 1;
      //   const skip = frequency * (newPage - 1);
      return newPage;
    });
  };

  //   if (loadingDebates) return <div>Chargement...</div>;
  if (errorDebates) return <div>Oops, une erreur est survenue</div>;

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          md={6}
          style={{
            overflowY: "scroll",
            height: window.innerHeight - 100,
          }}
        >
          <Paper
            style={{
              margin: 10,
              padding: 10,
              backgroundColor: "#fafafa",
              borderRadius: 10,
            }}
          >
            <div style={{ marginLeft: 10 }}>
              <h3>Débats</h3>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  Rechercher :{" "}
                  <select>
                    <option value="content">Le débat contient</option>
                    {/* <option value="user">Créé par</option>
                    <option value="vote">Choix de vote contient</option> */}
                  </select>{" "}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Votre recherche..."
                  ></input>{" "}
                  {/* <button>Rechercher</button> */}
                </Grid>
              </Grid>
              <br />
              {/* <button onClick={() => setFilterOpen((b) => !b)}>
                {filterOpen ? "Cacher les filtres" : "Afficher les filtres"}
              </button>
              <br />
              {filterOpen && (
                <Paper
                  style={{
                    padding: 10,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <button>Tout cocher</button>
                    </Grid>
                    <Grid item xs={3}>
                      <button>Tout décocher</button>
                    </Grid>
                    <Grid item xs={4}>
                      <button>Valeurs par défaut</button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={2}>
                      Status :
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Tous
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> En cours
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Terminé
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> En attente
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={2}>
                      Type :
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Tous
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Standard
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Duo
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Généré
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Couronne
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={2}>
                      Signalements :
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Tous
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Oui
                    </Grid>
                    <Grid item xs={2}>
                      <input type="checkbox"></input> Non
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      Trier par :{" "}
                      <select>
                        <option value="date_DESC">
                          Du plus récent au plus ancien
                        </option>
                        <option value="date_ASC">
                          Du plus ancien au plus récent
                        </option>
                        <option value="popularity">Par popularité</option>
                        <option value="votes">Par nombre de votes</option>
                        <option value="comments">
                          Par nombre de commentaires
                        </option>
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
              )}*/}
            </div>
            <br />
            <br />
            <Grid container spacing={3} style={{ marginLeft: "auto" }}>
              <Grid item xs={12}>
                {page !== 1 && (
                  <button
                    onClick={() => changePage("prev")}
                    disabled={loadingDebates}
                  >
                    Page précédente
                  </button>
                )}
                <span style={{ marginLeft: 5, marginRight: 5 }}>
                  Page {page}
                </span>
                <button
                  onClick={() => changePage("next")}
                  disabled={loadingDebates || debates.length === 0}
                >
                  Page suivante
                </button>
              </Grid>
            </Grid>

            {loadingDebates ? (
              <div>Chargement...</div>
            ) : (
              debates.map((debate) => {
                const nbVotes =
                  debate.positives.length +
                  debate.negatives.length +
                  debate.blueVotes.length +
                  debate.redVotes.length;
                return (
                  <Paper
                    style={{
                      margin: 10,
                      padding: 10,
                      borderRadius: 10,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderStyle: "solid",
                    }}
                  >
                    <div>ID: {debate.id}</div>
                    <div>
                      Créé par :{" "}
                      {debate.type === "DUO"
                        ? `${debate.ownerBlue.firstname} ${debate.ownerBlue.lastname} (${debate.ownerBlue.email}) et ${debate.ownerRed.firstname} ${debate.ownerRed.lastname} (${debate.ownerRed.email})`
                        : `${debate.owner.firstname} ${debate.owner.lastname} - (${debate.owner.email})`}
                    </div>
                    <div>
                      Créé le :{" "}
                      {moment(debate.createdAt).format("DD MMM YYYY - hh:mm")}
                    </div>
                    <div>Status : {defineStatus(debate)}</div>
                    <br />
                    {debate.type !== "MUDDLE" && (
                      <>
                        {" "}
                        <div>
                          Nombre de signalement : {debate.reports.length}
                        </div>
                        {/* <div>
                          Nombre de signalement non-résolus :{" "}
                          {
                            debate.reports.filter((r) => r.treated === false)
                              .length
                          }
                        </div> */}
                        <button
                          onClick={() => {
                            setComments(null);
                            setReports(debate.reports);
                          }}
                          disabled={debate.reports.length === 0}
                        >
                          Voir les signalement
                        </button>
                      </>
                    )}
                    <br />
                    <br />

                    <div>Type de débat : {getDebateType(debate.type)}</div>
                    {debate.type !== "MUDDLE" && (
                      <div>Couronne : {debate.crowned ? "Oui" : "Non"}</div>
                    )}
                    <br />
                    <div>Nombre de commentaires : {debate.comments.length}</div>
                    <button
                      onClick={() => {
                        setComments(debate.comments);
                        setReports(null);
                      }}
                      disabled={debate.comments.length === 0}
                    >
                      Voir les commentaires
                    </button>
                    <div>Nombre de votes : {nbVotes}</div>
                    {debate.type === "DUO" ? (
                      <>
                        <div>
                          Proposition de {debate.ownerBlue.firstname}{" "}
                          {debate.ownerBlue.lastname} : {debate.answerOne} -
                          Votes : {debate.positives.length} soit{" "}
                          {nbVotes === 0
                            ? 0
                            : Math.round(
                                (debate.positives.length / nbVotes) * 100
                              )}
                          %
                        </div>
                        <div>
                          Proposition de {debate.ownerRed.firstname}{" "}
                          {debate.ownerRed.lastname} : {debate.answerTwo} -
                          Votes : {debate.negatives.length} soit{" "}
                          {nbVotes === 0
                            ? 0
                            : Math.round(
                                (debate.negatives.length / nbVotes) * 100
                              )}
                          %
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          Choix 1 : {debate.answerOne} - Votes :{" "}
                          {debate.positives.length} soit{" "}
                          {nbVotes === 0
                            ? 0
                            : Math.round(
                                (debate.positives.length / nbVotes) * 100
                              )}
                          %
                        </div>
                        <div>
                          Choix 2 : {debate.answerTwo} - Votes :{" "}
                          {debate.negatives.length} soit{" "}
                          {nbVotes === 0
                            ? 0
                            : Math.round(
                                (debate.negatives.length / nbVotes) * 100
                              )}
                          %
                        </div>
                      </>
                    )}
                    <br />
                    {debate.content}
                    {debate.image !== null && debate.image.length > 0 && (
                      <img
                        src={debate.image}
                        alt={debate.image}
                        style={{ width: 400 }}
                      />
                    )}
                    <br />
                    <br />
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        {debate.closed === false && (
                          <button
                            onClick={() =>
                              askSure(
                                "Êtes-vous sûr de clore ce débat ?",
                                async () => {
                                  await closeDebate({
                                    variables: {
                                      debateId: debate.id,
                                    },
                                  });
                                  refetch();
                                }
                              )
                            }
                          >
                            Clore le débat
                          </button>
                        )}
                        <br />
                        <button
                          onClick={() =>
                            askSure(
                              "Êtes-vous sûr de supprimer ce débat ?",
                              async () => {
                                await deleteDebate({
                                  variables: {
                                    debateId: debate.id,
                                  },
                                });
                                refetch();
                              }
                            )
                          }
                        >
                          Supprimer le débat
                        </button>
                        {debate.type === "DUO" && (
                          <button
                            onClick={() =>
                              askSure(
                                `Êtes-vous sûr de bannir les deux utilisateurs ?`,
                                async () => {
                                  await banUser({
                                    variables: {
                                      userId: debate.ownerBlue.id,
                                    },
                                  });
                                  await banUser({
                                    variables: {
                                      userId: debate.ownerRed.id,
                                    },
                                  });
                                  refetch();
                                }
                              )
                            }
                          >
                            Bannir les deux utilisateurs
                          </button>
                        )}
                      </Grid>
                      {debate.type === "STANDARD" && (
                        <Grid item xs={4}>
                          {/* <button>Voir la fiche utilisateur</button> */}
                          {/* <br /> */}
                          <button
                            onClick={() =>
                              askSure(
                                `Êtes-vous sûr de bannir cet utilisateur ?`,
                                async () => {
                                  await banUser({
                                    variables: {
                                      userId: debate.owner.id,
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
                      )}
                      {debate.type === "DUO" && (
                        <>
                          <Grid item xs={4}>
                            {/* <button>
                              Voir la fiche de {debate.ownerRed.firstname}{" "}
                              {debate.ownerRed.lastname}
                            </button> */}
                            {/* <br /> */}
                            <button
                              onClick={() =>
                                askSure(
                                  `Êtes-vous sûr de bannir cet utilisateur ?`,
                                  async () => {
                                    await banUser({
                                      variables: {
                                        userId: debate.ownerRed.id,
                                      },
                                    });
                                    refetch();
                                  }
                                )
                              }
                            >
                              Bannir {debate.ownerRed.firstname}{" "}
                              {debate.ownerRed.lastname}
                            </button>
                          </Grid>
                          <Grid item xs={4}>
                            {/* <button>
                              Voir la fiche de {debate.ownerBlue.firstname}{" "}
                              {debate.ownerBlue.lastname}
                            </button> */}
                            {/* <br /> */}
                            <button
                              onClick={() =>
                                askSure(
                                  `Êtes-vous sûr de bannir cet utilisateur ?`,
                                  async () => {
                                    await banUser({
                                      variables: {
                                        userId: debate.ownerBlue.id,
                                      },
                                    });
                                    refetch();
                                  }
                                )
                              }
                            >
                              Bannir {debate.ownerBlue.firstname}{" "}
                              {debate.ownerBlue.lastname}
                            </button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Paper>
                );
              })
            )}
            {debates.length !== 0 && loadingDebates === false && (
              <Grid container spacing={3} style={{ marginLeft: "auto" }}>
                <Grid item xs={12}>
                  {page !== 1 && (
                    <button onClick={() => changePage("prev")}>
                      Page précédente
                    </button>
                  )}
                  <span style={{ marginLeft: 5, marginRight: 5 }}>
                    Page {page}
                  </span>
                  <button onClick={() => changePage("next")}>
                    Page suivante
                  </button>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{
            overflowY: "scroll",
            height: window.innerHeight - 100,
          }}
        >
          {/* REPORTS */}
          {reports !== null && (
            <Paper
              style={{
                margin: 10,
                padding: 10,
                backgroundColor: "#fafafa",
                borderRadius: 10,
              }}
            >
              <div style={{ marginLeft: 10 }}>
                <button onClick={() => setReports(null)}>Fermer</button>
                <h3>Signalements</h3>
              </div>
              <br />
              <br />
              {reports.map((report) => {
                return (
                  <Paper
                    style={{
                      margin: 10,
                      padding: 10,
                      borderRadius: 10,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderStyle: "solid",
                    }}
                  >
                    <div>ID: {report.id}</div>
                    <div>
                      Signalé par : {report.from.firstname}{" "}
                      {report.from.lastname} - ({report.from.email})
                    </div>
                    <br />
                    <div>Raison : {report.reason}</div>
                    <div>Message : {report.reasonText}</div>
                    <br />
                    {report.type === "COMMENT" && (
                      <>
                        <div>
                          Publié par : {report.comment.from.firstname}{" "}
                          {report.comment.from.lastname} - (
                          {report.comment.from.email})
                        </div>
                        <div>Commentaire signalé :</div>
                        <div>{report.comment.content}</div>
                        <br />
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
                                    setComments(null);
                                    setReports(null);
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
                                  `Êtes-vous sûr d'annuler ce signalement ?`,
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
                      </>
                    )}
                    {report.type === "DEBATE" && (
                      <>
                        <div>
                          Publié par :{" "}
                          {report.debate.type === "DUO"
                            ? `${report.debate.ownerBlue.firstname} ${report.debate.ownerBlue.lastname} (${report.debate.ownerBlue.email}) et 
                              ${report.debate.ownerRed.firstname} ${report.debate.ownerRed.lastname} (${report.debate.ownerRed.email})`
                            : `${report.debate.owner.firstname} ${report.debate.owner.lastname} (${report.debate.owner.email})`}
                        </div>
                        <div>Débat signalé</div>
                        <div>Choix 1 : {report.debate.answerOne}</div>
                        <div>Choix 2 : {report.debate.answerTwo}</div>
                        <div>{report.debate.content}</div>
                        {report.debate.image !== null &&
                          report.debate.image.length > 0 && (
                            <img
                              src={report.debate.image}
                              alt={report.debate.image}
                              style={{
                                width: 400,
                              }}
                            />
                          )}
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
                                  `Êtes-vous sûr d'annuler ce signalement ?`,
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
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <br />
                  </Paper>
                );
              })}
            </Paper>
          )}

          {/* COMMENTS */}
          {comments !== null && reports === null && (
            <Paper
              style={{
                margin: 10,
                padding: 10,
                backgroundColor: "#fafafa",
                borderRadius: 10,
              }}
            >
              <div style={{ marginLeft: 10 }}>
                <button onClick={() => setComments(null)}>Fermer</button>
                <h3>Commentaires</h3>
                {/* <Grid container spacing={3}>
                  <Grid item xs={12}>
                    Rechercher :{" "}
                    <select>
                      <option value="content">Le commentaire contient</option>
                      <option value="user">Créé par</option>
                    </select>{" "}
                    <input placeholder="Votre recherche..."></input>{" "}
                    <button>Rechercher</button>
                  </Grid>
                </Grid>
                <br />
                <button onClick={() => setFilterCommentOpen((b) => !b)}>
                  {filterCommentOpen
                    ? "Cacher les filtres"
                    : "Afficher les filtres"}
                </button> */}
                <br />
                {/* {filterCommentOpen && (
                  <Paper
                    style={{
                      padding: 10,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={2}>
                        Signalements :
                      </Grid>
                      <Grid item xs={2}>
                        <input type="checkbox"></input> Tous
                      </Grid>
                      <Grid item xs={2}>
                        <input type="checkbox"></input> Oui
                      </Grid>
                      <Grid item xs={2}>
                        <input type="checkbox"></input> Non
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        Trier par :{" "}
                        <select>
                          <option value="date_DESC">
                            Du plus récent au plus ancien
                          </option>
                          <option value="date_ASC">
                            Du plus ancien au plus récent
                          </option>
                          <option value="likes">Classé par likes</option>
                          <option value="dislikes">Classé par dislikes</option>
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
              <br />
              {comments.map((comment, index) => {
                return (
                  <Paper
                    style={{
                      margin: 10,
                      padding: 10,
                      borderRadius: 10,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderStyle: "solid",
                    }}
                  >
                    <div>ID: {comment.id}</div>
                    <div>
                      Publié par : {comment.from.firstname}{" "}
                      {comment.from.lastname} - ({comment.from.email})
                    </div>
                    <div>
                      Publié le :{" "}
                      {moment(comment.createdAt).format("DD MMM YYYY - hh:mm")}
                    </div>
                    <br />
                    <div>Nombre de signalements : {comment.reports.length}</div>
                    {/* <div>
                      Nombre de signalements non-résolus :{" "}
                      {
                        comment.reports.filter((r) => r.treated === false)
                          .length
                      }
                    </div> */}
                    <button
                      onClick={() => setReports(comment.reports)}
                      disabled={comment.reports.length === 0}
                    >
                      Voir les signalements
                    </button>
                    <br />
                    <br />
                    <div>Likes : {comment.likes.length}</div>
                    <div>Dislikes : {comment.dislikes.length}</div>
                    <br />
                    <div>{comment.content}</div>
                    <br />
                    <button
                      onClick={() =>
                        askSure(
                          `Êtes-vous sûr de supprimer ce commentaire ?`,
                          async () => {
                            await deleteComment({
                              variables: {
                                commentId: comment.id,
                              },
                            });
                            refetch();
                            setComments((cs) => {
                              const csCopy = cloneDeep(cs);
                              csCopy.splice(index, 1);
                              return csCopy;
                            });
                          }
                        )
                      }
                    >
                      Supprimer le commentaire
                    </button>
                  </Paper>
                );
              })}
            </Paper>
          )}
        </Grid>
      </Grid>
    </main>
  );
};

export default Debates;
