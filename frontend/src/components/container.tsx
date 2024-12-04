import { Stack } from "@mui/joy";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  return (
    <Stack sx={{ width: "100%", alignItems: "center" }}>
      <Stack component="main" sx={{ maxWidth: { xs: "90%", sm: 400 }, alignItems: "center", mt: 2, gap: 4 }}>
        {children}
      </Stack>
    </Stack>
  );
};
