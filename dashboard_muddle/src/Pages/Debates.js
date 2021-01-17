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

const GET_DEBATES = gql`
  query {
    debates(orderBy: createdAt_DESC) {
      id
      type
      content
      comments {
        id
      }
      owner {
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
      ownerRed {
        id
        firstname
        lastname
        email
      }
      positives {
        id
      }
      negatives {
        id
      }
      redVotes {
        id
      }
      blueVotes {
        id
      }
      answerOne
      answerTwo
      crowned
      image
      reports {
        id
        treated
      }
      createdAt
      closed
      published
      timelimit
      image
      crowned
    }
  }
`;

const GET_REPORTS = gql`
  query {
    reports(orderBy: createdAt_DESC) {
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
          "DDD MMM YYYY à hh:mm"
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

const Debates = (props) => {
  const classes = useStyles();
  const {
    data: debatesData,
    loading: loadingDebates,
    error: errorDebates,
  } = useQuery(GET_DEBATES);

  if (loadingDebates) return <div>Chargement...</div>;
  if (errorDebates) return <div>Oops, une erreur est survenue</div>;

  const { debates } = debatesData;

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
              <h4>Filtres :</h4>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  Rechercher :{" "}
                  <select>
                    <option value="content">Le débat contient</option>
                    <option value="user">Créé par</option>
                    <option value="vote">Choix de vote contient</option>
                  </select>{" "}
                  <input placeholder="Votre recherche..."></input>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <button>Tout cocher</button>
                </Grid>
                <Grid item xs={3}>
                  <button>Tout décocher</button>
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
                    <option value="comments">Par nombre de commentaires</option>
                  </select>
                </Grid>
                <Grid item xs={6}>
                  Nombre de résultats par page :{" "}
                  <select>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <button>Appliquer les changements</button>
                </Grid>
                <Grid item xs={6}>
                  <button>Réinitialiser les champs</button>
                </Grid>
              </Grid>
            </div>
            <br />
            {debates.map((debate) => {
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
                  }}
                >
                  <div>ID: {debate.id}</div>
                  <div>
                    Créé par :{" "}
                    {debate.type === "DUO"
                      ? `${debate.ownerRed.firstname} ${debate.ownerRed.lastname} (${debate.ownerRed.email}) et ${debate.ownerBlue.firstname} ${debate.ownerBlue.lastname} (${debate.ownerBlue.email})`
                      : `${debate.owner.firstname} ${debate.owner.lastname} - (${debate.owner.email})`}
                  </div>
                  <div>
                    Créé le :{" "}
                    {moment(debate.createdAt).format("DDD MMM YYYY - hh:mm")}
                  </div>
                  <div>Status : {defineStatus(debate)}</div>
                  <br />
                  {debate.type !== "MUDDLE" && (
                    <>
                      {" "}
                      <div>Nombre de signalement : {debate.reports.length}</div>
                      <div>
                        Nombre de signalement non-résolus :{" "}
                        {
                          debate.reports.filter((r) => r.treated === false)
                            .length
                        }
                      </div>
                      <button>Voir les signalement</button>
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
                  <button>Voir les commentaires</button>
                  <div>Nombre de votes : {nbVotes}</div>
                  {debate.type === "DUO" ? (
                    <>
                      <div>
                        Proposition de {debate.ownerBlue.firstname}{" "}
                        {debate.ownerBlue.lastname} : {debate.answerOne} - Votes
                        : {debate.positives.length} soit{" "}
                        {nbVotes === 0
                          ? 0
                          : Math.round(
                              (debate.positives.length / nbVotes) * 100
                            )}
                        %
                      </div>
                      <div>
                        Proposition de {debate.ownerRed.firstname}{" "}
                        {debate.ownerRed.lastname} : {debate.answerTwo} - Votes
                        : {debate.negatives.length} soit{" "}
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
                      <button>Clore le débat</button>
                      <br />
                      <button>Supprimer le débat</button>
                      {debate.type === "DUO" && (
                        <button>Bannir les deux utilisateurs</button>
                      )}
                    </Grid>
                    {debate.type === "STANDARD" && (
                      <Grid item xs={4}>
                        <button>Voir la fiche utilisateur</button>
                        <br />
                        <button>Bannir l'utilisateur</button>
                      </Grid>
                    )}
                    {debate.type === "DUO" && (
                      <>
                        <Grid item xs={4}>
                          <button>
                            Voir la fiche de {debate.ownerRed.firstname}{" "}
                            {debate.ownerRed.lastname}
                          </button>
                          <br />
                          <button>
                            Bannir {debate.ownerRed.firstname}{" "}
                            {debate.ownerRed.lastname}
                          </button>
                        </Grid>
                        <Grid item xs={4}>
                          <button>
                            Voir la fiche de {debate.ownerBlue.firstname}{" "}
                            {debate.ownerBlue.lastname}
                          </button>
                          <br />
                          <button>
                            Bannir {debate.ownerBlue.firstname}{" "}
                            {debate.ownerBlue.lastname}
                          </button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              );
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper></Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default Debates;
