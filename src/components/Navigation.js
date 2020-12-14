import React from "react";
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import LogoutIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import AssessmentIcon from "@material-ui/icons/Assessment";
import GroupIcon from "@material-ui/icons/Group";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    marginRight: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 240,
  },
}));

const Navigation = () => {
  const classes = useStyles();
  const { currentUser, logout } = useAuth();

  const [state, setState] = React.useState({
    left: false,
  });

  const listItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      link: "/",
    },
    {
      text: "Menu",
      icon: <MenuBookIcon />,
      link: "/menu",
    },
    {
      text: "Reports",
      icon: <AssessmentIcon />,
      link: "/reports",
    },
    {
      text: "Orders",
      icon: <RestaurantMenuIcon />,
      link: "/orders",
    },
    {
      text: "Users",
      icon: <GroupIcon />,
      link: "/users",
    },
    {
      text: "Log Out",
      icon: <LogoutIcon />,
      link: "",
    },
  ];

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {listItems.map((listItem, index) => {
          const { text, icon, link } = listItem;
          return (
            <React.Fragment key={index}>
              {index !== 5 ? (
                <ListItem button component={Link} to={link}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{text}</ListItemText>
                </ListItem>
              ) : (
                <ListItem button onClick={async () => await logout()}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{text}</ListItemText>
                </ListItem>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Toolbar />
            {list(anchor)}
          </Drawer>
          <div className={classes.root}>
            {currentUser && (
              <AppBar position="static">
                <Toolbar>
                  <IconButton
                    className={classes.menu}
                    onClick={toggleDrawer(anchor, true)}
                  >
                    <MenuIcon color="secondary" />
                  </IconButton>
                  <Typography
                    variant="h6"
                    color="secondary"
                    className={classes.title}
                  >
                    KJSIEIT Canteen Admin
                  </Typography>
                  {/* <IconButton
                    color="secondary"
                    
                  >
                    <LogoutIcon />
                  </IconButton> */}
                </Toolbar>
              </AppBar>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default withRouter(Navigation);
