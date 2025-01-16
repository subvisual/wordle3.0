import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../abis/WordleToken.abi";
import { useChainAddress } from "../utils/chains";
import { showToast } from "../utils/toast";

export const useMintTokens = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { tokenAddress } = useChainAddress();
  const { writeContractAsync } = useWriteContract();

  // Handle check balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    abi: WordleTokenABI,
    address: tokenAddress,
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
        address: tokenAddress,
        functionName: "mintTokens"
      });
      setHash(response);
    } catch (err: any) {
      showToast("error", "Error minting tokens.");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Handle wait for mint tokens contract function receipt
  const { isSuccess: hasWaitedForMint, isError: hasWaitError } = useWaitForTransactionReceipt({ hash });

  // Handle refetch after approve contract function has waited
  const handleHasWaited = async () => {
    if (!hash) {
      return;
    }
    if (hasWaitError) {
      showToast("error", "Error minting tokens.");
      setIsLoading(false);
    }
    if (hasWaitedForMint) {
      try {
        await refetchBalance();
        showToast("success", "Tokens minted successfully!");
      } catch (err: any) {
        console.error(err);
        showToast("error", "Transaction failed while waiting for receipt.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleHasWaited();
  }, [hasWaitedForMint, hasWaitError]);

  return {
    handleMintTokens,
    refetchBalance,
    hasTokens,
    isLoading
  };
};
