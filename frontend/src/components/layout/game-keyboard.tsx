import { Button, Stack } from "@mui/joy";

type GameKeyboardBox = {
  guess: string;
  setGuess: (prev: (prev: string) => string) => void;
  isLoadingGame: boolean;
  handleSubmitGuess: (allowance: number) => void;
  allowance: number;
};

export const GameKeyboard = ({ guess, setGuess, isLoadingGame, handleSubmitGuess, allowance }: GameKeyboardBox) => {
  const ROW1 = "QWERTYUIOP".split("");
  const ROW2 = "ASDFGHJKL".split("");
  const ROW3 = "ZXCVBNM".split("");

  const handleLetterClick = (letter: string) => {
    if (guess.length < 5) setGuess(prev => prev + letter);
  };

  const handleDelete = () => {
    if (guess.length > 0) setGuess(prev => prev.slice(0, -1));
  };

  const lettersSize = { width: 40, height: 55 };
  const actionsSize = { width: 62, height: 55 };

  return (
    <Stack component="section" sx={{ justifyContent: "center", gap: 0.5 }}>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        {ROW1.map(letter => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            color="neutral"
            disabled={isLoadingGame}
            sx={lettersSize}
          >
            {letter}
          </Button>
        ))}
      </Stack>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        {ROW2.map(letter => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            color="neutral"
            disabled={isLoadingGame}
            sx={lettersSize}
          >
            {letter}
          </Button>
        ))}
      </Stack>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        <Button onClick={handleDelete} color="neutral" disabled={isLoadingGame} sx={actionsSize}>
          Delete
        </Button>
        {ROW3.map(letter => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            color="neutral"
            disabled={isLoadingGame}
            sx={lettersSize}
          >
            {letter}
          </Button>
        ))}
        <Button
          onClick={() => handleSubmitGuess(allowance)}
          color="success"
          disabled={guess.length < 5}
          loading={isLoadingGame}
          sx={{ ...actionsSize, bgcolor: "success.700" }}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
