import { extendTheme } from "@mui/joy/styles";

export const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {},
        background: {
          body: "#1a1a1a"
        }
      }
    }
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.neutral[700],
          border: "1px solid",
          borderRadius: "2px",
          borderColor: theme.vars.palette.neutral[600],
          transition: "0.3s"
        })
      }
    }
  }
});
