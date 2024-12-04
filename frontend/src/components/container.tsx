import { Stack } from "@mui/joy";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  return (
    <Stack component="main" sx={{ width: "100%", alignItems: "center", mt: 2 }}>
      {children}
    </Stack>
  );
};
