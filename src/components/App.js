import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";

import Navigation from "./Navigation";
import Dashboard from "./Dashboard/Dashboard";
import KitchenDashboard from "./Kitchen/Dashboard";
import ListMenuItems from "./Menu/ListMenuItems";
import AddMenuItem from "./Menu/AddMenuItem";
import Orders from "./Orders/Orders";
import Reports from "./Reports";
import Users from "./Users";
import Login from "./Auth/Login";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./Auth/ForgotPassword";
import Categories from "./Categories";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />

            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/kitchen" component={KitchenDashboard} />
            <PrivateRoute exact path="/menu" component={ListMenuItems} />
            <PrivateRoute path="/menu/add" component={AddMenuItem} />
            <PrivateRoute path="/categories" component={Categories} />
            <PrivateRoute path="/orders" component={Orders} />
            <PrivateRoute path="/reports" component={Reports} />
            <PrivateRoute path="/users" component={Users} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
