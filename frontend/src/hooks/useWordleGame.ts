import { useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { GAME_ADDRESS } from "../config/constants";

export const useWordleGame = () => {
  const { writeContract, isPending } = useWriteContract();

  const makeGuess = (guess: string) => {
    writeContract({
      address: GAME_ADDRESS,
      abi: WordleGameABI,
      functionName: "guess",
      args: [guess]
    });
  };

  return { makeGuess, isPending };
};
