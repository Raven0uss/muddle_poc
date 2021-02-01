import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
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

const GET_ADS = gql`
  query($skip: Int!) {
    ads(skip: $skip) {
      id
      name
      company
      companyIcon
      content
      image
      link
      active
      ratio
    }
  }
`;

const DELETE_AD = gql`
  mutation($adId: ID!) {
    deleteAd(where: { id: $adId }) {
      id
    }
  }
`;

const UPDATE_AD = gql`
  mutation(
    $adId: ID!
    $name: String
    $active: Boolean
    $ratio: Int
    $company: String
    $companyIcon: String
    $link: String
    $content: String
    $image: String
  ) {
    updateAd(
      where: { id: $adId }
      data: {
        name: $name
        active: $active
        ratio: $ratio
        company: $company
        companyIcon: $companyIcon
        link: $link
        content: $content
        image: $image
      }
    ) {
      id
    }
  }
`;

const Ads = (props) => {
  const [ads, setAds] = React.useState([]);
  const [selectedAd, setSelectedAd] = React.useState(null);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);

  const { loading, error, refetch } = useQuery(GET_ADS, {
    variables: {
      skip: page,
    },
    onCompleted: (response) => {
      if ("ads" in response) setAds(response.ads);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [deleteAd] = useMutation(DELETE_AD, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });
  const [updateAd] = useMutation(UPDATE_AD, {
    onCompleted: () => {
      setPage((p) => p + 1);
      setPage((p) => p - 1);
    },
  });

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div style={{ marginLeft: 10 }}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={6}
            md={6}
            style={{
              overflowY: "scroll",
              height: window.innerHeight - 100,
            }}
          >
            <h3>Publicités</h3>
            <div>
              <h4>Publicités actives</h4>
            </div>
            {ads
              .filter((ad) => ad.active)
              .sort((a, b) => b.ratio - a.ratio)
              .map((ad) => (
                <Paper
                  style={{
                    padding: 10,
                    margin: 10,
                  }}
                >
                  <div>ID: {ad.id}</div>
                  <div>Titre: {ad.name}</div>
                  <br />
                  <div>Société : {ad.company}</div>
                  <div>
                    Icone :{" "}
                    <img
                      src={ad.companyIcon}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                    />
                  </div>
                  <br />
                  Lien commercial :{" "}
                  {ad.link ? (
                    <a href={ad.link} target="_blank">
                      {ad.link}
                    </a>
                  ) : (
                    "Non"
                  )}
                  <br />
                  <br />
                  <div>Texte : {ad.content}</div>
                  <div>
                    Illustration :{" "}
                    <img src={ad.image} style={{ height: 300 }} />
                  </div>
                  <br />
                  <div>Ratio: {ad.ratio}</div>
                  <br />
                  <div>
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                      }}
                    >
                      Modifier la Publicité
                    </button>
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        askSure("Supprimer cette publicité ?", async () => {
                          await deleteAd({
                            variables: {
                              adId: ad.id,
                            },
                          });
                          refetch();
                        });
                      }}
                    >
                      Supprimer la Publicité
                    </button>
                  </div>
                </Paper>
              ))}

            <div>
              <h4>Publicités inactives</h4>
            </div>
            {ads
              .filter((ad) => ad.active === false)
              .sort((a, b) => b.ratio - a.ratio)
              .map((ad) => (
                <Paper
                  style={{
                    padding: 10,
                    margin: 10,
                  }}
                >
                  <div>ID: {ad.id}</div>
                  <div>Titre: {ad.name}</div>
                  <br />
                  <div>Société : {ad.company}</div>
                  <div>
                    Icone :{" "}
                    <img
                      src={ad.companyIcon}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                    />
                  </div>
                  <br />
                  Lien commercial :{" "}
                  {ad.link ? (
                    <a href={ad.link} target="_blank">
                      {ad.link}
                    </a>
                  ) : (
                    "Non"
                  )}
                  <br />
                  <br />
                  <div>Texte : {ad.content}</div>
                  <div>
                    Illustration :{" "}
                    <img src={ad.image} style={{ height: 300 }} />
                  </div>
                  <div>Ratio: {ad.ratio}</div>
                  <br />
                  <div>
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                      }}
                    >
                      Modifier la Publicité
                    </button>
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        askSure("Supprimer cette publicité ?", async () => {
                          await deleteAd({
                            variables: {
                              adId: ad.id,
                            },
                          });
                          refetch();
                        });
                      }}
                    >
                      Supprimer la Publicité
                    </button>
                  </div>
                </Paper>
              ))}
          </Grid>
          <Grid
            item
            xs={6}
            md={6}
            style={{
              overflowY: "scroll",
              height: window.innerHeight - 100,
            }}
          >
            {selectedAd !== null && (
              <Paper style={{ padding: 10, margin: 10 }}>
                <button
                  onClick={() => {
                    setSelectedAd(null);
                  }}
                >
                  Fermer
                </button>
                <br />
                <div>
                  <h4>Modifier la Publicité</h4>
                </div>
                <div>ID: {selectedAd.id}</div>
                <div>
                  Titre:{" "}
                  <input
                    value={selectedAd.name}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <br />
                Active :{" "}
                <input
                  type="checkbox"
                  checked={selectedAd.active}
                  onChange={(e) =>
                    setSelectedAd((a) => ({
                      ...a,
                      active: a.active ? false : true,
                    }))
                  }
                />
                <br />
                Ratio :{" "}
                <input
                  value={selectedAd.ratio}
                  type="number"
                  onChange={(e) =>
                    setSelectedAd((a) => ({
                      ...a,
                      ratio: e.target.value,
                    }))
                  }
                />
                <br />
                <div>
                  Société:{" "}
                  <input
                    value={selectedAd.company}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        company: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  Icone:{" "}
                  <input
                    value={selectedAd.companyIcon}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        companyIcon: e.target.value,
                      }))
                    }
                  />
                  <img
                    src={selectedAd.companyIcon}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    alt={selectedAd.companyIcon}
                  />
                </div>
                <br />
                <div>
                  Lien commercial :{" "}
                  <input
                    value={selectedAd.link}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        link: e.target.value,
                      }))
                    }
                  />
                </div>
                <br />
                <div>
                  Texte :{" "}
                  <textarea
                    value={selectedAd.content}
                    style={{ width: "100%", height: 150 }}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  Illustation :{" "}
                  <input
                    value={selectedAd.image}
                    onChange={(e) =>
                      setSelectedAd((a) => ({
                        ...a,
                        image: e.target.value,
                      }))
                    }
                  />
                  <img
                    src={selectedAd.image}
                    style={{ height: 300 }}
                    alt={selectedAd.image}
                  />
                </div>
                <br />
                <button
                  onClick={() => {
                    askSure("Sauvegarder cette publicité ?", async () => {
                      await updateAd({
                        variables: {
                          adId: selectedAd.id,
                          name: selectedAd.name,
                          active: selectedAd.active,
                          ratio: selectedAd.ratio,
                          company: selectedAd.company,
                          companyIcon: selectedAd.companyIcon,
                          link: selectedAd.link,
                          content: selectedAd.content,
                          image: selectedAd.image,
                        },
                      });
                      refetch();
                    });
                  }}
                >
                  Sauvegarder
                </button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </main>
  );
};

export default Ads;
