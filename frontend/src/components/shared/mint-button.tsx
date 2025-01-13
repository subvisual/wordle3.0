import { Button } from "@mui/joy";

type HomeMintProps = {
  handleMintTokens: () => void;
  playerAddress?: `0x${string}`;
  isMinting: boolean;
};

export const MintButton = ({ handleMintTokens, playerAddress, isMinting }: HomeMintProps) => {
  return (
    <Button
      fullWidth
      size="lg"
      color="neutral"
      onClick={handleMintTokens}
      disabled={!playerAddress}
      loading={isMinting}
    >
      Mint
    </Button>
  );
};
