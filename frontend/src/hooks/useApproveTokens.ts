import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../abis/WordleToken.abi";
import { ENV_VARS } from "../config/constants";
import { showToast } from "../utils/toast";

export const useApproveTokens = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Handle check allowance
  const { data, refetch: refetchAllowance } = useReadContract({
    abi: WordleTokenABI,
    address: ENV_VARS.WORDLE_TOKEN_ADDRESS,
    functionName: "allowance",
    args: [playerAddress as `0x${string}`, ENV_VARS.WORDLE_GAME_ADDRESS]
  });

  const allowance = data ? Number(formatEther(data)) : 0;

  // Handle approve tokens
  const handleApproveTokens = async () => {
    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        abi: WordleTokenABI,
        address: ENV_VARS.WORDLE_TOKEN_ADDRESS,
        functionName: "approve",
        args: [ENV_VARS.WORDLE_GAME_ADDRESS, BigInt(5 * 10 ** 18)]
      });
      setHash(response);
    } catch (err: any) {
      showToast("error", "Failed to approve tokens. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wait for approve contract function receipt
  const { isSuccess: hasWaitedForApprove } = useWaitForTransactionReceipt({ hash });

  // Trigger refetch after approve contract function has waited
  useEffect(() => {
    if (hasWaitedForApprove) {
      refetchAllowance();
    }
  }, [hasWaitedForApprove, refetchAllowance]);

  return {
    handleApproveTokens,
    refetchAllowance,
    allowance,
    isLoading
  };
};
