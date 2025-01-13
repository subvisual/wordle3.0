import { useEffect, useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { ENV_VARS } from "../config/constants";
import { showToast } from "../utils/toast";

type UseSetWordProps = {
  refetchPlayerGuesses: () => void;
  refetchHasPlayerGuessedCorrectly: () => void;
  refetchLetterStatusesData: () => void;
};

export const useSetWord = ({
  refetchPlayerGuesses,
  refetchHasPlayerGuessedCorrectly,
  refetchLetterStatusesData
}: UseSetWordProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { writeContractAsync } = useWriteContract();

  // Handle check admin address
  const { data: adminAddress } = useReadContract({
    abi: WordleGameABI,
    address: ENV_VARS.WORDLE_GAME_ADDRESS,
    functionName: "admin"
  });

  // Handle set new word by admin
  const handleSetWord = async (newWord: string) => {
    if (newWord.length !== 5) {
      showToast("error", "Word must be 5 letters!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        address: ENV_VARS.WORDLE_GAME_ADDRESS,
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

  // Handle wait for make guess contract function receipt
  const { isSuccess: hasWaitedForWord } = useWaitForTransactionReceipt({ hash });

  // Trigger refetch after setWord contract function has waited
  useEffect(() => {
    if (hasWaitedForWord) {
      refetchPlayerGuesses();
      refetchHasPlayerGuessedCorrectly();
      refetchLetterStatusesData();
    }
  }, [hasWaitedForWord, refetchPlayerGuesses, refetchHasPlayerGuessedCorrectly, refetchLetterStatusesData]);

  return {
    handleSetWord,
    adminAddress,
    hasWaitedForWord,
    isLoading
  };
};
