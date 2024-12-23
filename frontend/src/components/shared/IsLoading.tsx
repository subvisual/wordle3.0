import { Box, CircularProgress } from "@mui/joy";

export const IsLoading = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
      <CircularProgress size="lg" />
    </Box>
  );
};
