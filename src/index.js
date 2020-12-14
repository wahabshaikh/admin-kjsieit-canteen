import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";

let theme = createMuiTheme({
  palette: {
    primary: { main: "#ea8b26" },
    secondary: { main: "#e6dbc8" },
    // secondary: { main: "#f7dd6f" },
  },
  typography: {
    fontFamily: [
      "Comfortaa",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
