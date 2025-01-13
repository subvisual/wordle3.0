export const ENV_VARS = {
  PUBLIC_PROJECT_ID: import.meta.env.VITE_PUBLIC_PROJECT_ID || "",
  WORDLE_TOKEN_ADDRESS: import.meta.env.VITE_WORDLE_TOKEN_ADDRESS || "",
  WORDLE_GAME_ADDRESS: import.meta.env.VITE_WORDLE_GAME_ADDRESS || ""
};

export const TOKEN_DECIMALS = 18;
export const NUMBER_OF_GUESSES = 5;
