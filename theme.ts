import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f", // Red
    },
    secondary: {
      main: "#1976d2", // Blue
    },
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
