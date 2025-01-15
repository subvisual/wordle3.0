import { useChainId } from "wagmi";
import { CHAIN_ID, ENV_VARS } from "../config/constants";

export const useChainAddress = () => {
  const chainId = useChainId();

  let tokenAddress = "" as `0x${string}`;
  let gameAddress = "" as `0x${string}`;

  if (chainId === CHAIN_ID.anvil) {
    tokenAddress = ENV_VARS.WORDLE_TOKEN_ANVIL_ADDRESS;
    gameAddress = ENV_VARS.WORDLE_GAME_ANVIL_ADDRESS;
  } else if (chainId === CHAIN_ID.sepolia) {
    tokenAddress = ENV_VARS.WORDLE_TOKEN_SEPOLIA_ADDRESS;
    gameAddress = ENV_VARS.WORDLE_GAME_SEPOLIA_ADDRESS;
  }

  return { tokenAddress, gameAddress };
};
