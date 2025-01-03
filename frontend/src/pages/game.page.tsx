import { Box } from "@mui/joy";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { GameApprove } from "../components/layout/game-approve";
import { GameGuess } from "../components/layout/game-guess";
import { GameKeyboard } from "../components/layout/game-keyboard";
import { MainContainer } from "../components/shared/container";
import { IsLoading } from "../components/shared/IsLoading";
import { useGameContract } from "../hooks/useGameContract";
import { useTokenContract } from "../hooks/useTokenContract";

export const GamePage = () => {
  // States
  const [guess, setGuess] = useState<string>("");

  // Hooks
  const { handleApproveTokens, handleCheckAllowance, allowance, isLoading: isLoadingToken } = useTokenContract();
  const {
    handleSubmitGuess,
    getUserGuessesArray,
    getLetterStatusesArray,
    isLoading: isLoadingGame
  } = useGameContract({ guess });

  return (
    <MainContainer>
      <ConnectButton />
      {isLoadingGame ? (
        <IsLoading />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <GameGuess
            guess={guess}
            getUserGuessesArray={getUserGuessesArray}
            getLetterStatusesArray={getLetterStatusesArray}
          />
          <GameApprove
            handleApproveTokens={handleApproveTokens}
            handleCheckAllowance={handleCheckAllowance}
            allowance={allowance}
            isLoading={isLoadingToken || isLoadingGame}
          />
          <GameKeyboard
            guess={guess}
            setGuess={setGuess}
            isLoadingGame={isLoadingGame}
            handleSubmitGuess={handleSubmitGuess}
            allowance={allowance}
          />
        </Box>
      )}
    </MainContainer>
  );
};
