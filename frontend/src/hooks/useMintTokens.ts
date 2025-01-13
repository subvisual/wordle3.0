import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../abis/WordleToken.abi";
import { ENV_VARS } from "../config/constants";
import { showToast } from "../utils/toast";

export const useMintTokens = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Handle check balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    abi: WordleTokenABI,
    address: ENV_VARS.WORDLE_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: playerAddress ? [playerAddress as `0x${string}`] : undefined
  });

  const hasTokens = useMemo(() => {
    return balanceData ? Number(formatEther(balanceData)) > 0 : false;
  }, [balanceData]);

  // Handle mint tokens
  const handleMintTokens = async () => {
    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        abi: WordleTokenABI,
        address: ENV_VARS.WORDLE_TOKEN_ADDRESS,
        functionName: "mintTokens"
      });
      setHash(response);
    } catch (err: any) {
      showToast("error", "Error minting tokens.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wait for mint tokens contract function receipt
  const { isSuccess: hasWaitedForMint } = useWaitForTransactionReceipt({ hash });

  // Update balance when the receipt is received
  useEffect(() => {
    if (hasWaitedForMint) {
      refetchBalance();
    }
  }, [hasWaitedForMint, refetchBalance]);

  return {
    handleMintTokens,
    refetchBalance,
    hasTokens,
    isLoading
  };
};
