import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { MainContainer } from "../components/shared/container";
import { MintButton } from "../components/shared/mint-button";
import { useMintTokens } from "../hooks/useMintTokens";

export const HomePage = () => {
  const { address: playerAddress, isConnected } = useAccount();
  const { handleMintTokens, hasTokens, isLoading: isMinting } = useMintTokens();
  return (
    <MainContainer>
      <ConnectButton />
      {isConnected && !hasTokens && (
        <MintButton handleMintTokens={handleMintTokens} playerAddress={playerAddress} isMinting={isMinting} />
      )}
    </MainContainer>
  );
};
