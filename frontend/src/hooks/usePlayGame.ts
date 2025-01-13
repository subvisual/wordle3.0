import { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { ENV_VARS } from "../config/constants";
import { showToast } from "../utils/toast";

type UseUsePlayGameProps = {
  guess: string;
  refetchBalance: () => void;
  refetchAllowance: () => void;
};

export const usePlayGame = ({ guess, refetchBalance, refetchAllowance }: UseUsePlayGameProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Handle check player guesses
  const {
    data: playerGuesses,
    refetch: refetchPlayerGuesses,
    isLoading: isLoadingPlayerGuesses
  } = useReadContract({
    abi: WordleGameABI,
    address: ENV_VARS.WORDLE_GAME_ADDRESS,
    functionName: "getPlayerGuesses",
    args: [playerAddress as `0x${string}`]
  }) as { data: string[]; refetch: () => void; isLoading: boolean };

  const playerGuessesArray: string[] = Array.isArray(playerGuesses) ? playerGuesses : [];

  // Handle check if player has guessed correctly
  const {
    data: hasPlayerGuessedCorrectly,
    refetch: refetchHasPlayerGuessedCorrectly,
    isLoading: isLoadingHasPlayerGuessedCorrectly
  } = useReadContract({
    abi: WordleGameABI,
    address: ENV_VARS.WORDLE_GAME_ADDRESS,
    functionName: "getHasPlayerGuessedCorrectly",
    args: [playerAddress as `0x${string}`]
  }) as { data: boolean; refetch: () => void; isLoading: boolean };

  // Handle check letter statuses
  const letterStatusesMap =
    playerGuessesArray.length > 0
      ? Array.from({ length: playerGuessesArray.length }).map(
          (_, index) =>
            ({
              abi: WordleGameABI,
              address: ENV_VARS.WORDLE_GAME_ADDRESS,
              functionName: "getLetterStatuses",
              args: [playerAddress as `0x${string}`, BigInt(index)]
            }) as const
        )
      : [];

  const {
    data: letterStatusesData,
    refetch: refetchLetterStatusesData,
    isLoading: isLoadingLetterStatusesData
  } = useReadContracts({
    contracts: letterStatusesMap
  });

  const letterStatusesArray =
    letterStatusesData?.map(item => (item.result ? { data: Array.from(item.result) } : { data: [] })) || [];

  // Handle submit guess
  const handleSubmitGuess = async (allowance: number, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      switch (true) {
        case allowance <= 0:
          showToast("error", "You need allowance to play the game.");
          break;
        case hasPlayerGuessedCorrectly:
          showToast("error", "You have already guessed correctly!");
          break;
        case Array.isArray(playerGuesses) && playerGuesses.length >= 5:
          showToast("error", "You already exceeded the limit play tries for today!");
          break;
        default:
          const response = await writeContractAsync({
            address: ENV_VARS.WORDLE_GAME_ADDRESS,
            abi: WordleGameABI,
            functionName: "makeGuess",
            args: [guess]
          });
          setHash(response);
          if (onSuccess) {
            onSuccess();
          }
      }
    } catch (err: any) {
      showToast("error", "Failed to submit guess. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wait for make guess contract function receipt
  const { isSuccess: hasWaitedForGuess } = useWaitForTransactionReceipt({ hash });

  // Trigger refetch after makeGuess contract function has waited
  useEffect(() => {
    if (hasWaitedForGuess) {
      refetchPlayerGuesses();
      refetchHasPlayerGuessedCorrectly();
      refetchLetterStatusesData();
      refetchAllowance();
      refetchBalance();
    }
  }, [hasWaitedForGuess, refetchPlayerGuesses, refetchHasPlayerGuessedCorrectly, refetchLetterStatusesData]);

  return {
    handleSubmitGuess,
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    playerGuessesArray,
    letterStatusesArray,
    hasPlayerGuessedCorrectly,
    hasWaitedForGuess,
    isLoading: isLoading || isLoadingPlayerGuesses || isLoadingHasPlayerGuessedCorrectly || isLoadingLetterStatusesData
  };
};
