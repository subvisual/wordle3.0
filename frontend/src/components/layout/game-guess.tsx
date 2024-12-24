import { Box, Grid, Stack, Typography } from "@mui/joy";
import { NUMBER_OF_GUESSES } from "../../config/constants";

type GameGuessBoxProps = {
  guess: string;
  getUserGuessesArray: string[];
};

export const GameGuess = ({ guess, getUserGuessesArray }: GameGuessBoxProps) => {
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
  return (
    <Stack component="section" sx={{ gap: 1 }}>
      {guessesToShow.map((rowGuess: string, rowIndex: number) => (
        <Grid container key={rowIndex} sx={{ justifyContent: "center", gap: 1 }}>
          {Array.from(rowGuess).map((letter, colIndex) => (
            <Box
              key={colIndex}
              sx={{
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
              <Typography level="h2" sx={{ color: "neutral.50" }}>
                {letter.trim().toUpperCase()}
              </Typography>
            </Box>
          ))}
        </Grid>
      ))}
    </Stack>
  );
};
