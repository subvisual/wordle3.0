import { useReadContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { WORDLE_GAME_ADDRESS } from "../config/constants";

export const useReadGameGuess = (guess: string) => {
  const { data: readGuess } = useReadContract({
    address: WORDLE_GAME_ADDRESS,
    abi: WordleGameABI,
    functionName: "guesses",
    args: [guess]
  });
  return { readGuess };
};
