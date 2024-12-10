import { useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { WORDLE_GAME_ADDRESS } from "../config/constants";

export const useWriteGameContract = () => {
  const { writeContract, isPending } = useWriteContract();

  const makeGuess = (guess: string) => {
    writeContract({
      address: WORDLE_GAME_ADDRESS,
      abi: WordleGameABI,
      functionName: "guess",
      args: [guess]
    });
  };

  return { makeGuess, isPending };
};

/*   const result = useSimulateContract({
    address: GAME_ADDRESS,
    abi: WordleGameABI,
    functionName: "guess",
    args: [word.toUpperCase()]
  }); */
