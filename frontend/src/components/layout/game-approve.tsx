import { Button, Stack } from "@mui/joy";

type GameApproveProps = {
  handleApproveTokens: () => void;
  handleCheckAllowance: () => void;
  allowance: number;
  isLoadingToken: boolean;
  isLoadingGame: boolean;
};

export const GameApprove = ({
  handleApproveTokens,
  handleCheckAllowance,
  allowance,
  isLoadingToken,
  isLoadingGame
}: GameApproveProps) => {
  return (
    <Stack component="section" sx={{ flexDirection: "row", gap: 1 }}>
      <Button
        size="lg"
        fullWidth
        onClick={handleApproveTokens}
        color="success"
        disabled={allowance > 0 || isLoadingGame}
        loading={isLoadingToken}
        sx={{ bgcolor: "success.700" }}
      >
        {allowance > 0 ? "Approved" : "Approve Tokens"}
      </Button>
      <Button
        size="lg"
        fullWidth
        onClick={handleCheckAllowance}
        color="neutral"
        disabled={isLoadingToken || isLoadingGame}
      >
        Check Allowance
      </Button>
    </Stack>
  );
};
