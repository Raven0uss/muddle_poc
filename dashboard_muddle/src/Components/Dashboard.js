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

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [path, setPath] = React.useState("home");
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
          <IconButton color="#000">
            <span
              style={{
                fontSize: 12,
                marginRight: 5,
              }}
            >
              Sid-Ahmed
            </span>
            <ProfileIcon />
          </IconButton>
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
            <hr />
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
          </div>
        </List>
        <Divider />
      </Drawer>

      {path === "home" && <Home />}
      {path === "debates" && <Debates />}
      {path === "reports" && <Reports />}
      {path === "users" && <Users />}
      {path === "ads" && <Ads />}
      {path === "createAd" && <CreateAd />}
      {path === "createDebate" && <CreateDebate />}
      {path === "createUser" && <CreateUser />}
    </div>
  );
}
