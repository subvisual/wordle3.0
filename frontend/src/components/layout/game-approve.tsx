import { Button, Stack } from "@mui/joy";

type GameApproveProps = {
  handleApproveTokens: () => void;
  handleCheckAllowance: () => void;
  allowance: number;
  isLoading: boolean;
};

export const GameApprove = ({ handleApproveTokens, handleCheckAllowance, allowance, isLoading }: GameApproveProps) => {
  return (
    <Stack component="section" sx={{ flexDirection: "row", gap: 1 }}>
      <Button
        size="lg"
        fullWidth
        onClick={handleApproveTokens}
        color="success"
        loading={isLoading}
        disabled={allowance > 0}
        sx={{ bgcolor: "success.700" }}
      >
        Approve Tokens
      </Button>
      <Button size="lg" fullWidth onClick={handleCheckAllowance} color="neutral" loading={isLoading}>
        Check Allowance
      </Button>
    </Stack>
  );
};
