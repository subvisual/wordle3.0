import { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { WORDLE_GAME_ADDRESS } from "../config/constants";
import { showToast } from "../utils/toast";
import { useTokenContract } from "./useTokenContract";

type UseGameContractProps = {
  guess: string;
};

export const useGameContract = ({ guess }: UseGameContractProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { refetchAllowance } = useTokenContract();

  // Handle check admin address
  const { data: adminAddress } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "admin"
  });

  // Handle check player guesses
  const {
    data: getPlayerGuesses,
    refetch: refetchPlayerGuesses,
    isLoading: isLoadingPlayerGuesses
  } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "getPlayerGuesses",
    args: [playerAddress as `0x${string}`]
  }) as { data: string[]; refetch: () => void; isLoading: boolean };

  const getPlayerGuessesArray: string[] = Array.isArray(getPlayerGuesses) ? getPlayerGuesses : [];

  // Handle check if player has guessed correctly
  const {
    data: getHasPlayerGuessedCorrectly,
    refetch: refetchHasPlayerGuessedCorrectly,
    isLoading: isLoadingHasPlayerGuessedCorrectly
  } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "getHasPlayerGuessedCorrectly",
    args: [playerAddress as `0x${string}`]
  }) as { data: boolean; refetch: () => void; isLoading: boolean };

  // Handle check letter statuses
  const getLetterStatusesMap =
    getPlayerGuessesArray.length > 0
      ? Array.from({ length: getPlayerGuessesArray.length }).map(
          (_, index) =>
            ({
              abi: WordleGameABI,
              address: WORDLE_GAME_ADDRESS,
              functionName: "getLetterStatuses",
              args: [playerAddress as `0x${string}`, BigInt(index)]
            }) as const
        )
      : [];

  const {
    data: getLetterStatusesData,
    refetch: refetchLetterStatusesData,
    isLoading: isLoadingLetterStatusesData
  } = useReadContracts({
    contracts: getLetterStatusesMap
  });

  const getLetterStatusesArray =
    getLetterStatusesData?.map(item => (item.result ? { data: Array.from(item.result) } : { data: [] })) || [];

  // Handle set new word by admin
  const handleSetWord = async (newWord: string) => {
    if (newWord.length !== 5) {
      showToast("error", "Word must be 5 letters!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        address: WORDLE_GAME_ADDRESS,
        abi: WordleGameABI,
        functionName: "setWord",
        args: [newWord]
      });
      setHash(response);
      showToast("success", "Word set successfully!");
    } catch (err: any) {
      showToast("error", "Failed to set word. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit guess
  const handleSubmitGuess = async (allowance: number, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      switch (true) {
        case allowance <= 0:
          showToast("error", "You need allowance to play the game.");
          break;
        case getHasPlayerGuessedCorrectly:
          showToast("error", "You have already guessed correctly!");
          break;
        case Array.isArray(getPlayerGuesses) && getPlayerGuesses.length >= 5:
          showToast("error", "You already exceeded the limit play tries for today!");
          break;
        default:
          const response = await writeContractAsync({
            address: WORDLE_GAME_ADDRESS,
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
    }
  }, [hasWaitedForGuess, refetchPlayerGuesses, refetchHasPlayerGuessedCorrectly, refetchLetterStatusesData]);

  return {
    handleSetWord,
    handleSubmitGuess,
    adminAddress,
    getPlayerGuessesArray,
    getLetterStatusesArray,
    getHasPlayerGuessedCorrectly,
    hasWaitedForGuess,
    isLoading: isLoading || isLoadingPlayerGuesses || isLoadingHasPlayerGuessedCorrectly || isLoadingLetterStatusesData
  };
};
