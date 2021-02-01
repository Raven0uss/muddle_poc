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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ProfileIcon from "@material-ui/icons/AccountBox";
import CreateAdIcon from "@material-ui/icons/AddToQueue";
import CreateUserIcon from "@material-ui/icons/PersonAdd";
import ReportIcon from "@material-ui/icons/Report";

import Chart from "./Chart";
import DebateStats from "./DebateStats";
import UserStats from "./UserStats";
import Orders from "./Orders";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import HomeIcon from "@material-ui/icons/Home";
import GavelIcon from "@material-ui/icons/Gavel";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import AssignmentIcon from "@material-ui/icons/Assignment";
import GradeIcon from "@material-ui/icons/Grade";

import StorageIcon from "@material-ui/icons/Storage";
import CloudIcon from "@material-ui/icons/Cloud";
import ImageIcon from "@material-ui/icons/Image";
import DomainIcon from "@material-ui/icons/Domain";

import Home from "../Pages/Home";
import Debates from "../Pages/Debates";
import Users from "../Pages/Users";
import Ads from "../Pages/Ads";
import CreateAd from "../Pages/CreateAd";
import CreateDebate from "../Pages/CreateDebate";
import CreateUser from "../Pages/CreateUser";

import logoMenu from "../logo_menu.png";

import "../App.css";
import Reports from "../Pages/Reports";
import SpecialUsers from "../Pages/UsersSpecials";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { get } from "lodash";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#f5f5f5",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#f5f5f5",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    color: "#000000",
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    color: "#000000",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#f5f5f5",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
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
    height: 350,
  },
  listItem: {
    fontSize: "200px !important",
  },
}));

const CHECK_TOKEN = gql`
  mutation($token: String!) {
    checkTokenDashboard(token: $token) {
      id
      role
    }
  }
`;

export default function Dashboard() {
  const [user, setUser] = React.useState(null);

  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [path, setPath] = React.useState("home");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [checkToken] = useMutation(CHECK_TOKEN, {
    onCompleted: (response) => {
      const queryUser = get(response, "checkTokenDashboard", {
        id: "0",
        role: "STANDARD",
      });
      console.log(queryUser);
      if (
        queryUser.id === "0" ||
        (queryUser.role !== "ADMIN" && queryUser.role !== "MODERATOR")
      ) {
        history.replace("/");
        localStorage.removeItem("token");
      } else {
        setUser(queryUser);
      }
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkToken({ variables: { token } });
    } else {
      history.replace("/");
    }
    const interval = setInterval(() => {
      if (token) {
        checkToken({ variables: { token } });
      } else {
        history.replace("/");
      }
    }, 10000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (user === null) return null;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {open === false && (
              <img
                src={logoMenu}
                alt="Muddles"
                style={{ width: 130, marginTop: 10 }}
              />
            )}
          </Typography>
          <IconButton color="#000" onClick={handleClick}>
            <span
              style={{
                fontSize: 12,
                marginRight: 5,
              }}
            >
              {user.role}
            </span>
            <ProfileIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: 50 }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                localStorage.removeItem("token");
                history.replace("/");
              }}
              style={{ color: "red" }}
            >
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          {open === true && (
            <img
              src={logoMenu}
              alt="Muddles"
              style={{ width: 130, marginRight: "auto" }}
            />
          )}
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon
              style={{
                color: "#000000",
              }}
            />
          </IconButton>
        </div>
        <Divider />
        <List
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Menu */}
          <div>
            <ListItem button onClick={() => setPath("home")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Accueil
                </span>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={() => setPath("debates")}>
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Gestion des débats
                </span>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={() => setPath("reports")}>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Signalements
                </span>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={() => setPath("users")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Utilisateurs
                </span>
              </ListItemText>
            </ListItem>
            {user.role === "ADMIN" && (
              <ListItem button onClick={() => setPath("specialUsers")}>
                <ListItemIcon>
                  <GradeIcon />
                </ListItemIcon>
                <ListItemText>
                  <span
                    style={{
                      fontFamily: "Montserrat",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Utilisateurs Spéciaux
                  </span>
                </ListItemText>
              </ListItem>
            )}
            <ListItem button onClick={() => setPath("ads")}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Publicités
                </span>
              </ListItemText>
            </ListItem>
            <Divider />
            {/* <hr /> */}
            <ListItem button onClick={() => setPath("createDebate")}>
              <ListItemIcon>
                <LibraryAddIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Nouveau débat
                </span>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={() => setPath("createAd")}>
              <ListItemIcon>
                <CreateAdIcon />
              </ListItemIcon>
              <ListItemText>
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Nouvelle publicité
                </span>
              </ListItemText>
            </ListItem>
            {user.role === "ADMIN" && (
              <ListItem button onClick={() => setPath("createUser")}>
                <ListItemIcon>
                  <CreateUserIcon />
                </ListItemIcon>
                <ListItemText>
                  <span
                    style={{
                      fontFamily: "Montserrat",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Nouvel utilisateur
                  </span>
                </ListItemText>
              </ListItem>
            )}
            {user.role === "ADMIN" && (
              <>
                <Divider />
                <ListItem
                  button
                  onClick={() =>
                    Object.assign(document.createElement("a"), {
                      target: "_blank",
                      href:
                        "https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Feu-west-3.console.aws.amazon.com%2Fecs%2Fhome%3Fregion%3Deu-west-3%26state%3DhashArgs%2523%252Fclusters%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fecs&forceMobileApp=0&code_challenge=EFGFl4Pjak-DFcwBAJApuoPmPnQTTq4eyHddyIfjQyE&code_challenge_method=SHA-256",
                    }).click()
                  }
                >
                  <ListItemIcon>
                    <CloudIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span
                      style={{
                        fontFamily: "Montserrat",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Amazon Web Services
                    </span>
                  </ListItemText>
                </ListItem>
                <ListItem
                  button
                  onClick={() =>
                    Object.assign(document.createElement("a"), {
                      target: "_blank",
                      href:
                        "https://account.mongodb.com/account/login?n=%2Fv2%2F5f7c687a453aba485b7fa788&nextHash=%23clusters",
                    }).click()
                  }
                >
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span
                      style={{
                        fontFamily: "Montserrat",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      MongoDB Atlas
                    </span>
                  </ListItemText>
                </ListItem>
                <ListItem
                  button
                  onClick={() =>
                    Object.assign(document.createElement("a"), {
                      target: "_blank",
                      href: "https://console.image4.io/Auth/Login",
                    }).click()
                  }
                >
                  <ListItemIcon>
                    <ImageIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span
                      style={{
                        fontFamily: "Montserrat",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Image4io
                    </span>
                  </ListItemText>
                </ListItem>
                <ListItem
                  button
                  onClick={() =>
                    Object.assign(document.createElement("a"), {
                      target: "_blank",
                      href:
                        "https://www.ovh.com/auth/?action=gotomanager&from=https://www.ovh.com/fr/&ovhSubsidiary=fr",
                    }).click()
                  }
                >
                  <ListItemIcon>
                    <DomainIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span
                      style={{
                        fontFamily: "Montserrat",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      OVH
                    </span>
                  </ListItemText>
                </ListItem>
              </>
            )}
          </div>
        </List>
        <Divider />
      </Drawer>

      {path === "home" && <Home />}
      {path === "debates" && <Debates />}
      {path === "reports" && <Reports />}
      {path === "users" && <Users />}
      {path === "specialUsers" && <SpecialUsers />}
      {path === "ads" && <Ads />}
      {path === "createAd" && <CreateAd />}
      {path === "createDebate" && <CreateDebate />}
      {path === "createUser" && <CreateUser />}
    </div>
  );
}
