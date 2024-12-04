import { Box, Button, Grid, Stack } from "@mui/joy";
import { useState } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const GameBoard = () => {
  const [word, setWord] = useState<string>("");
  const maxLetters = 5;

  const handleLetterClick = (letter: string) => {
    if (word.length < maxLetters) {
      setWord(prev => prev + letter);
    }
  };

  const handleDelete = () => {
    if (word.length > 0) {
      setWord(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (word.length === maxLetters) {
      alert(word);
      setWord("");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Word */}
      <Grid container sx={{ justifyContent: "space-between" }}>
        {Array.from({ length: maxLetters }).map((_, index) => (
          <Grid
            component={Stack}
            key={index}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid",
              height: { xs: 65, sm: 75 },
              width: { xs: 65, sm: 75 },
              fontSize: 32,
              fontWeight: "bold"
            }}
          >
            {word[index] || ""}
          </Grid>
        ))}
      </Grid>

      {/* Letters + Buttons */}
      <Grid container spacing={0.5} columns={6} sx={{ justifyContent: "center" }}>
        {ALPHABET.map(letter => (
          <Grid xs={1} key={letter}>
            <Button size="lg" fullWidth onClick={() => handleLetterClick(letter)} color="neutral">
              {letter}
            </Button>
          </Grid>
        ))}
        <Grid xs={2}>
          <Button size="lg" fullWidth onClick={handleDelete} color="neutral">
            Delete
          </Button>
        </Grid>
        <Grid xs={2}>
          <Button size="lg" fullWidth onClick={handleSubmit} disabled={word.length !== maxLetters} color="success">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
