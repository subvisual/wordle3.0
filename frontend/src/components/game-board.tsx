import { Box, Button, Grid, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NUMBER_OF_GUESSES } from "../config/constants";
import { useGameContract } from "../hooks/useGameContract";
import { useTokenContract } from "../hooks/useTokenContract";
import { IsLoading } from "./IsLoading";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTER_BG_COLORS = {
  2: "green",
  1: "orange",
  0: "grey"
};

export const GameBoard = () => {
  // States
  const [guess, setGuess] = useState<string>("");

  // Hooks
  const { handleApproveTokens, handleCheckAllowance, allowance, isLoading: isLoadingToken } = useTokenContract();
  const {
    handleSubmitGuess,
    hasWaitedForGuess,
    getUserGuessesArray,
    getLetterStatusesArray,
    hasUserGuessedCorrectly,
    isLoading: isLoadingGame
  } = useGameContract({ guess });

  // Function to Add Letters
  const handleLetterClick = (letter: string) => {
    if (guess.length < 5) setGuess(prev => prev + letter);
  };

  // Function to Delete Letters
  const handleDelete = () => {
    if (guess.length > 0) setGuess(prev => prev.slice(0, -1));
  };

  // Function to Get User Guesses
  const getGuesses = () => {
    const guessesToShow = [];
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
      if (i < getUserGuessesArray.length) {
        guessesToShow.push(getUserGuessesArray[i]);
      } else if (i === getUserGuessesArray.length) {
        guessesToShow.push(guess.padEnd(5, " "));
      } else {
        guessesToShow.push("".padEnd(5, " "));
      }
    }
    return guessesToShow;
  };

  // Function To Get Letters Background Color Based on Correctness
  const getLettersBgColor = (
    rowIndex: number,
    colIndex: number,
    array: { data: number[] }[],
    colors: object
  ): string => {
    const status = array[rowIndex]?.data?.[colIndex];
    return status !== undefined ? colors[status as keyof typeof colors] : "transparent";
  };

  // Use Effects
  useEffect(() => {
    if (hasWaitedForGuess) {
      if (hasUserGuessedCorrectly) {
        toast.success(`Your guess was correct!!`, { closeOnClick: true });
      } else {
        toast.error(`Your guess was incorrect...`, { closeOnClick: true });
      }
    }
  }, [hasWaitedForGuess, hasUserGuessedCorrectly]);

  return (
    <>
      {isLoadingGame ? (
        <IsLoading />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Guesses */}
          <Stack component="section" sx={{ gap: 1 }}>
            {getGuesses().map((rowGuess: string, rowIndex: number) => (
              <Grid container key={rowIndex} sx={{ justifyContent: "center", gap: 1 }}>
                {Array.from(rowGuess).map((letter, colIndex) => {
                  const backgroundColor = getLettersBgColor(
                    rowIndex,
                    colIndex,
                    getLetterStatusesArray,
                    LETTER_BG_COLORS
                  );
                  return (
                    <Box
                      key={colIndex}
                      sx={{
                        backgroundColor,
                        height: 60,
                        width: 60,
                        border: "1px solid",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 32,
                        fontWeight: "bold"
                      }}
                    >
                      {letter.trim().toUpperCase()}
                    </Box>
                  );
                })}
              </Grid>
            ))}
          </Stack>

          {/* Submit Approve Tokens Button */}
          <Stack component="section" sx={{ flexDirection: "row", gap: 1 }}>
            <Button
              size="lg"
              fullWidth
              onClick={handleApproveTokens}
              color="success"
              loading={isLoadingToken || isLoadingGame}
              disabled={allowance > 0}
            >
              Approve Tokens
            </Button>
            <Button
              size="lg"
              fullWidth
              onClick={handleCheckAllowance}
              color="neutral"
              loading={isLoadingToken || isLoadingGame}
            >
              Check Allowance
            </Button>
          </Stack>

          {/* Letters + Delete Button + Submit Guess Button */}
          <Grid component="section" container spacing={0.5} columns={6} sx={{ justifyContent: "center" }}>
            {ALPHABET.map(letter => (
              <Grid xs={1} key={letter}>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => handleLetterClick(letter)}
                  color="neutral"
                  disabled={isLoadingGame}
                >
                  {letter}
                </Button>
              </Grid>
            ))}
            <Grid xs={2}>
              <Button size="lg" fullWidth onClick={handleDelete} color="neutral" disabled={isLoadingGame}>
                Delete
              </Button>
            </Grid>
            <Grid xs={2}>
              <Button
                size="lg"
                fullWidth
                onClick={() => handleSubmitGuess(allowance)}
                color="success"
                disabled={guess.length < 5}
                loading={isLoadingGame}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
