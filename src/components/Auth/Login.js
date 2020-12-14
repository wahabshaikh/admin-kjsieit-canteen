import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";

import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import validateLogin from "./validateLogin";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  card: {
    margin: "auto",
    width: "50%",
  },

  margin: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },

  button: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    color: "theme.palette.textSecondary",
  },

  errorText: {
    color: red[500],
  },

  link: {
    color: theme.palette.primary.main,
  },
}));

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});

  const { currentUser, login } = useAuth();
  const history = useHistory();

  const authenticateUser = async () => {
    try {
      await login(email, password);
      history.push("/");
    } catch (error) {
      setIsError(true);
      setErrors({ firebase: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin(email, password);
    if (Object.keys(errors).length === 0) {
      authenticateUser();
    } else {
      setIsError(true);
      setErrors(errors);
    }
  };

  return (
    <React.Fragment className={classes.root}>
      {currentUser && history.push("/")}
      <Toolbar />
      <Card className={classes.card}>
        <CardContent>
          <Typography component="h1" variant="h4" color="textSecondary">
            Login
          </Typography>
          {isError && (
            <Typography className={classes.errorText}>
              {errors.firebase}
            </Typography>
          )}

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              className={classes.margin}
              error={isError && (errors.firebase || errors.email)}
              fullWidth
              label="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              variant="outlined"
              value={email}
            />
            {errors.email && (
              <Typography className={classes.errorText}>
                {errors.email}
              </Typography>
            )}

            <TextField
              className={classes.margin}
              error={isError && (errors.firebase || errors.password)}
              fullWidth
              label="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              variant="outlined"
              value={password}
            />
            {errors.password && (
              <Typography className={classes.errorText}>
                {errors.password}
              </Typography>
            )}

            <Button
              className={classes.button}
              color="primary"
              fullWidth
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </form>

          <Typography>
            <Link className={classes.link} to="/forgot-password">
              Forgot Password?
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Login;
