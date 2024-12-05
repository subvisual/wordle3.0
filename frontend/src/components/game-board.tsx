import { Box, Button, Grid, Stack } from "@mui/joy";
import { useState } from "react";
import { gameContract } from "../services/ethers";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const GameBoard = () => {
  const [word, setWord] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const handleSubmit = async () => {
    if (word.length === maxLetters) {
      try {
        setIsSubmitting(true);

        const tx = await gameContract.guess(word.toUpperCase(), {
          gasLimit: 300000
        });
        console.log("Transaction sent:", tx.hash); // remove later
        await tx.wait();
        console.log("Word submitted."); // remove later
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
        setWord("");
      }
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
            <Button
              size="lg"
              fullWidth
              onClick={() => handleLetterClick(letter)}
              disabled={isSubmitting}
              color="neutral"
            >
              {letter}
            </Button>
          </Grid>
        ))}
        <Grid xs={2}>
          <Button size="lg" fullWidth onClick={handleDelete} disabled={isSubmitting} color="neutral">
            Delete
          </Button>
        </Grid>
        <Grid xs={2}>
          <Button
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={word.length !== maxLetters}
            loading={isSubmitting}
            color="success"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
