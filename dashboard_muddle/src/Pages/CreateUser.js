import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { isEmpty } from "lodash";
import moment from "moment";

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

const CREATE_USER = gql`
  mutation(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $birthdate: DateTime!
    $role: String
    $gender: String
    $certified: Boolean
    $private: Boolean
    $profilePicture: String
    $coverPicture: String
  ) {
    createNewUser(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
      birthdate: $birthdate
      role: $role
      gender: $gender
      certified: $certified
      private: $private
      profilePicture: $profilePicture
      coverPicture: $coverPicture
    ) {
      id
    }
  }
`;

const CreateUser = (props) => {
  const [user, setUser] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    birthdate: "01/01/2000",
    role: "STANDARD",
    gender: "NO_INDICATION",
    certified: false,
    profilePicture: "",
    coverPicture: "",
    private: false,
  });
  const classes = useStyles();

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    variables: user,
    onCompleted: () => {
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        birthdate: "01/01/2000",
        role: "STANDARD",
        gender: "NO_INDICATION",
        certified: false,
        profilePicture: "",
        coverPicture: "",
        private: false,
      });
    },
  });

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7} xl={5}>
          <Paper
            style={{
              margin: 20,
              padding: 20,
            }}
          >
            <h4>Nouvel utilisateur</h4>
            <br />
            <input
              placeholder="Prénom"
              value={user.firstname}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  firstname: e.target.value,
                }))
              }
            />
            <input
              placeholder="Nom"
              value={user.lastname}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  lastname: e.target.value,
                }))
              }
            />
            <input
              placeholder="Email"
              value={user.email}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  email: e.target.value,
                }))
              }
            />
            <br />
            <br />
            <input
              placeholder="Mot de passe"
              value={user.password}
              type="password"
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  password: e.target.value,
                }))
              }
            />
            <br />
            <br />
            Date de naissance :{" "}
            <input
              placeholder="Format xx/xx/xxxx"
              value={user.birthdate}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  birthdate: e.target.value,
                }))
              }
            />
            <br />
            Role :{" "}
            <select
              value={user.role}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  role: e.target.value,
                }))
              }
            >
              <option value="STANDARD">Standard</option>
              <option value="MODERATOR">Modérateur</option>
              <option value="ADMIN">Administrateur</option>
              <option value="MUDDLE">Compte Muddle</option>
            </select>
            <br />
            <br />
            Sexe :{" "}
            <select
              value={user.gender}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  gender: e.target.value,
                }))
              }
            >
              <option value="NO_INDICATION">Non défini</option>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
            <br />
            <br />
            Certifié :{" "}
            <input
              type="checkbox"
              checked={user.certified}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  certified: !u.certified,
                }))
              }
            />
            Privé :{" "}
            <input
              type="checkbox"
              checked={user.private}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  private: !u.private,
                }))
              }
            />
            <br />
            <input
              placeholder="Photo de profil"
              value={user.profilePicture}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  profilePicture: e.target.value,
                }))
              }
            />
            <input
              placeholder="Photo de couverture"
              value={user.coverPicture}
              onChange={(e) =>
                setUser((u) => ({
                  ...u,
                  coverPicture: e.target.value,
                }))
              }
            />
            <br />
            <br />
            <button
              disabled={
                loading ||
                isEmpty(user.firstname) ||
                isEmpty(user.lastname) ||
                isEmpty(user.email) ||
                isEmpty(user.password) ||
                isEmpty(user.birthdate) 
                // ||
                // moment(user.birthdate).isValid() === false
              }
              onClick={async () => {
                await createUser();
              }}
            >
              Créer l'utilisateur
            </button>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default CreateUser;
