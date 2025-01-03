import { Box, Grid, Stack } from "@mui/joy";
import { motion } from "framer-motion";
import { LETTER_BG_COLORS, NUMBER_OF_GUESSES } from "../../config/constants";

type GameGuessBoxProps = {
  guess: string;
  getUserGuessesArray: string[];
  getLetterStatusesArray: { data: number[] }[];
};

export const GameGuess = ({ guess, getUserGuessesArray, getLetterStatusesArray }: GameGuessBoxProps) => {
  // Function to Get User Guesses
  const getGuesses = () => {
    // This adds the rows of the user's previous guesses
    const guessesToShow = [...getUserGuessesArray];
    // This adds the row where the user is typing the current guess
    if (guessesToShow.length < NUMBER_OF_GUESSES) {
      guessesToShow.push(guess.padEnd(5, " "));
    }
    // This adds aditional empty rows until NUMBER_OF_GUESSES is matched
    while (guessesToShow.length < NUMBER_OF_GUESSES) {
      guessesToShow.push("".padEnd(5, " "));
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

  return (
    <Stack component="section" sx={{ gap: 1 }}>
      {getGuesses().map((rowGuess: string, rowIndex: number) => (
        <Grid container key={rowIndex} sx={{ justifyContent: "center", gap: 1 }}>
          {Array.from(rowGuess).map((letter, colIndex) => {
            const isCurrentRow = rowIndex === getUserGuessesArray.length;
            const backgroundColor = getLettersBgColor(rowIndex, colIndex, getLetterStatusesArray, LETTER_BG_COLORS);
            return (
              <Box
                key={colIndex}
                component={motion.div}
                initial={{ scale: 1 }}
                animate={isCurrentRow && letter.trim() && { scale: [1, 1.1, 1] }}
                transition={{ duration: 0.1 }}
                sx={{
                  color: "#F8F8ED",
                  backgroundColor,
                  height: 60,
                  width: 60,
                  border: "1px solid",
                  borderColor: "neutral.700",
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
  );
};
