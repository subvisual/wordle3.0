import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { WORDLE_GAME_ADDRESS } from "../config/constants";
import { useTokenContract } from "./useTokenContract";

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
  const { refetchAllowance } = useTokenContract();

  // Read User Guesses
  const {
    data: getUserGuesses,
    refetch: refetchUserGuesses,
    isLoading: isLoadingGuesses
  } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "getUserGuesses",
    args: [userAddress as `0x${string}`]
  }) as { data: string[]; refetch: () => void; isLoading: boolean };

  const getUserGuessesArray: string[] = Array.isArray(getUserGuesses) ? getUserGuesses : [];

  // Read Has User Guessed Correctly
  const {
    data: hasUserGuessedCorrectly,
    refetch: refetchCorrect,
    isLoading: isLoadingCorrect
  } = useReadContract({
    abi: WordleGameABI,
    address: WORDLE_GAME_ADDRESS,
    functionName: "hasUserGuessedCorrectly",
    args: [userAddress as `0x${string}`]
  }) as { data: boolean; refetch: () => void; isLoading: boolean };

  // Read Letter Statuses
  const getLetterStatusesMap =
    getUserGuessesArray.length > 0
      ? Array.from({ length: getUserGuessesArray.length }).map(
          (_, index) =>
            ({
              abi: WordleGameABI,
              address: WORDLE_GAME_ADDRESS,
              functionName: "getLetterStatuses",
              args: [userAddress as `0x${string}`, BigInt(index)]
            }) as const
        )
      : [];

  const {
    data: getLetterStatusesData,
    refetch: refetchLetterStatuses,
    isLoading: isLoadingStatusesData
  } = useReadContracts({
    contracts: getLetterStatusesMap
  });

  const getLetterStatusesArray =
    getLetterStatusesData?.map(item => (item.result ? { data: Array.from(item.result) } : { data: [] })) || [];

  // Handle Submit Guess Button
  const handleSubmitGuess = async (allowance: number, onSuccess?: () => void) => {
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
          if (onSuccess) {
            onSuccess();
          }
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

  // Trigger refetch
  useEffect(() => {
    if (hasWaitedForGuess) {
      refetchUserGuesses();
      refetchCorrect();
      refetchLetterStatuses();
      refetchAllowance();
      toast.success("Guess submitted successfully!", { closeOnClick: true });
    }
  }, [hasWaitedForGuess, refetchUserGuesses, refetchCorrect, refetchLetterStatuses]);

  return {
    handleSubmitGuess,
    getUserGuessesArray,
    getLetterStatusesArray,
    hasUserGuessedCorrectly,
    isLoading: isLoading || isLoadingGuesses || isLoadingCorrect || isLoadingStatusesData
  };
};
