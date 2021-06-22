import React, { useState } from "react";
import {
  Button,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import validateLogin from "./validateLogin";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  margin: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setErrors] = useState(null);

  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin(email, password);
    setErrors(errors);
    try {
      await login(email, password);
    } catch (error) {}
    history.push("/");
  };

  return (
    <React.Fragment className={classes.root}>
      <Toolbar>
        <Typography component="h1" variant="h4" color="textSecondary">
          Reset Password
        </Typography>
      </Toolbar>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.margin}
          error={true}
          fullWidth
          label="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          variant="outlined"
          value={email}
        />
        <TextField
          className={classes.margin}
          fullWidth
          label="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          variant="outlined"
          value={password}
        />
        <Button
          className={classes.margin}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Log In
        </Button>
      </form>

      <Link to="/forgot-password">
        <Typography>Forgot Password?</Typography>
      </Link>
    </React.Fragment>
  );
};

export default ForgotPassword;
