import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import { isEmpty, isNil } from "lodash";
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

const CREATE_AD = gql`
  mutation(
    $name: String!
    $active: Boolean!
    $ratio: Int!
    $company: String!
    $companyIcon: String!
    $link: String
    $content: String!
    $image: String!
  ) {
    createAd(
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

const CreateAd = (props) => {
  const [selectedAd, setSelectedAd] = React.useState({
    name: "",
    active: true,
    ratio: 1,
    company: "",
    companyIcon: "",
    link: "",
    content: "",
    image: "",
  });
  const classes = useStyles();

  const [createAd] = useMutation(CREATE_AD);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid item xs={6} md={6}>
        <Paper style={{ padding: 10, margin: 10 }}>
          <div>
            <h4>Creer une publicité</h4>
          </div>
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
                await createAd({
                  variables: {
                    name: selectedAd.name,
                    active: selectedAd.active,
                    ratio: parseInt(selectedAd.ratio, 10),
                    company: selectedAd.company,
                    companyIcon: selectedAd.companyIcon,
                    link: selectedAd.link,
                    content: selectedAd.content,
                    image: selectedAd.image,
                  },
                });
                setSelectedAd({
                  name: "",
                  active: true,
                  ratio: 1,
                  company: "",
                  companyIcon: "",
                  link: "",
                  content: "",
                  image: "",
                });
              });
            }}
            disabled={(() => {
              if (
                isEmpty(selectedAd.name) ||
                isEmpty(selectedAd.company) ||
                isEmpty(selectedAd.companyIcon) ||
                isEmpty(selectedAd.content)
              )
                return true;
              return false;
            })()}
          >
            Sauvegarder
          </button>
        </Paper>
      </Grid>
    </main>
  );
};

export default CreateAd;
