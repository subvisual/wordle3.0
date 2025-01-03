import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../abis/WordleToken.abi";
import { WORDLE_GAME_ADDRESS, WORDLE_TOKEN_ADDRESS } from "../config/constants";

export const useTokenContract = () => {
  // States
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read Allowance
  const { data, refetch: refetchAllowance } = useReadContract({
    abi: WordleTokenABI,
    address: WORDLE_TOKEN_ADDRESS,
    functionName: "allowance",
    args: [userAddress as `0x${string}`, WORDLE_GAME_ADDRESS]
  });

  const allowance = data ? Number(formatEther(data)) : 0;

  // Handle Approve Tokens Button
  const handleApproveTokens = async () => {
    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        address: WORDLE_TOKEN_ADDRESS,
        abi: WordleTokenABI,
        functionName: "approve",
        args: [WORDLE_GAME_ADDRESS, BigInt(10 * 10 ** 18)]
      });
      setHash(response);
    } catch (err: any) {
      toast.error("Failed to approve tokens. Please try again.", { closeOnClick: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Wait For Transaction Receipt
  const { isSuccess: hasWaitedForApprove } = useWaitForTransactionReceipt({ hash });

  // Handle Check Allowance Button
  const handleCheckAllowance = async () => {
    toast.info(`Your allowance is: ${allowance} TKN.`, { closeOnClick: true });
  };

  // Trigger refetch
  useEffect(() => {
    if (hasWaitedForApprove) {
      refetchAllowance();
      toast.success("Tokens approved successfully!", { closeOnClick: true });
    }
  }, [hasWaitedForApprove, refetchAllowance]);

  return {
    handleApproveTokens,
    handleCheckAllowance,
    refetchAllowance,
    allowance,
    isLoading
  };
};
