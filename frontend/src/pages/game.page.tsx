import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { GameAdmin } from "../components/layout/game-admin";
import { GameApprove } from "../components/layout/game-approve";
import { GameGuess } from "../components/layout/game-guess";
import { GameKeyboard } from "../components/layout/game-keyboard";
import { MainContainer } from "../components/shared/container";
import { useApproveTokens } from "../hooks/useApproveTokens";
import { useMintTokens } from "../hooks/useMintTokens";
import { usePlayGame } from "../hooks/usePlayGame";
import { useSetWord } from "../hooks/useSetWord";

export const GamePage = () => {
  const [guess, setGuess] = useState<string>("");

  const { address: playerAddress } = useAccount();
  const { refetchBalance } = useMintTokens();
  const { handleApproveTokens, refetchAllowance, allowance, isLoading: isLoadingToken } = useApproveTokens();
  const {
    handleSubmitGuess,
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    playerGuessesArray,
    letterStatusesArray,
    hasPlayerGuessedCorrectly,
    isLoading: isLoadingGame
  } = usePlayGame({ guess, refetchBalance, refetchAllowance });
  const {
    handleSetWord,
    adminAddress,
    isLoading: isLoadingNewWord
  } = useSetWord({ refetchPlayerGuesses, refetchHasPlayerGuessedCorrectly, refetchLetterStatusesData });
  const isDisabled = isLoadingNewWord || isLoadingToken || isLoadingGame;

  return (
    <MainContainer>
      <ConnectButton />
      <GameGuess guess={guess} playerGuessesArray={playerGuessesArray} letterStatusesArray={letterStatusesArray} />
      {playerAddress === adminAddress && (
        <GameAdmin handleSetWord={handleSetWord} isLoadingNewWord={isLoadingNewWord} isDisabled={isDisabled} />
      )}
      <GameApprove
        handleApproveTokens={handleApproveTokens}
        allowance={allowance}
        isLoadingToken={isLoadingToken}
        isDisabled={isDisabled}
      />
      <GameKeyboard
        guess={guess}
        setGuess={setGuess}
        handleSubmitGuess={handleSubmitGuess}
        allowance={allowance}
        hasPlayerGuessedCorrectly={hasPlayerGuessedCorrectly}
        playerGuessesArray={playerGuessesArray}
        letterStatusesArray={letterStatusesArray}
        isLoadingGame={isLoadingGame}
        isDisabled={isDisabled}
      />
    </MainContainer>
  );
};
