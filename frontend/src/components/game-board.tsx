import { Box, Button } from "@mui/joy";
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
    <Box>
      <Box>
        {Array.from({ length: maxLetters }).map((_, index) => (
          <Box component={Button} key={index}>
            {word[index]}
          </Box>
        ))}
      </Box>

      <Box>
        {ALPHABET.map(letter => (
          <Button key={letter} onClick={() => handleLetterClick(letter)} disabled={word.length === maxLetters}>
            {letter}
          </Button>
        ))}

        <Button onClick={handleDelete} disabled={word.length <= 0}>
          Delete
        </Button>

        <Button onClick={handleSubmit} disabled={word.length !== maxLetters}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
