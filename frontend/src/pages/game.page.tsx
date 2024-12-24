import { Box } from "@mui/joy";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
    hasWaitedForGuess,
    getUserGuessesArray,
    hasUserGuessedCorrectly,
    isLoading: isLoadingGame
  } = useGameContract({ guess });

  // Use Effects
  useEffect(() => {
    if (hasWaitedForGuess) {
      if (hasUserGuessedCorrectly) {
        toast.success(`Your guess was correct!!`, { closeOnClick: true });
      } else {
        toast.error(`Your guess was incorrect...`, { closeOnClick: true });
      }
    }
  }, [hasWaitedForGuess, hasUserGuessedCorrectly]);

  return (
    <MainContainer>
      <ConnectButton />
      {isLoadingGame ? (
        <IsLoading />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <GameGuess guess={guess} getUserGuessesArray={getUserGuessesArray} />
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
