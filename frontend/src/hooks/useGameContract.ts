import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { WORDLE_GAME_ADDRESS } from "../config/constants";

type UseGameContractProps = {
  guess: string;
};

export const useGameContract = ({ guess }: UseGameContractProps) => {
  // States
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read User Guesses
  const { data: getUserGuesses, isLoading: isLoadingGuesses } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "getUserGuesses",
    args: [userAddress]
  }) as { data: string[]; isLoading: boolean };

  const getUserGuessesArray: string[] = Array.isArray(getUserGuesses) ? getUserGuesses : [];

  // Read Has User Guessed Correctly
  const { data: hasUserGuessedCorrectly, isLoading: isLoadingCorrect } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "hasUserGuessedCorrectly",
    args: [userAddress]
  }) as { data: boolean; isLoading: boolean };

  // Handle Submit Guess Button
  const handleSubmitGuess = async (allowance: number) => {
    setIsLoading(true);
    try {
      switch (true) {
        case allowance <= 0:
          toast.error("You need allowance to play the game.", { closeOnClick: true });
          break;
        case hasUserGuessedCorrectly:
          toast.error("You have already guessed correctly!", { closeOnClick: true });
          break;
        case Array.isArray(getUserGuesses) && getUserGuesses.length >= 5:
          toast.error("You already exceeded the limit play tries for today!", { closeOnClick: true });
          break;
        default:
          const response = await writeContractAsync({
            address: WORDLE_GAME_ADDRESS,
            abi: WordleGameABI,
            functionName: "guess",
            args: [guess]
          });
          setHash(response);
      }
    } catch (err: any) {
      toast.error("Failed to submit guess. Please try again.", { closeOnClick: true });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Wait For Transaction Receipt
  const { isSuccess: hasWaitedForGuess } = useWaitForTransactionReceipt({ hash });

  return {
    handleSubmitGuess,
    hasWaitedForGuess,
    getUserGuessesArray,
    hasUserGuessedCorrectly,
    isLoading: isLoading || isLoadingGuesses || isLoadingCorrect
  };
};
