import { Button, Stack } from "@mui/joy";

type GameKeyboardProps = {
  guess: string;
  setGuess: (value: string | ((value: string) => string)) => void;
  handleSubmitGuess: (allowance: number, onSuccess?: () => void) => void;
  allowance: number;
  hasUserGuessedCorrectly: boolean;
  isLoadingGame: boolean;
};

export const GameKeyboard = ({
  guess,
  setGuess,
  handleSubmitGuess,
  allowance,
  hasUserGuessedCorrectly,
  isLoadingGame
}: GameKeyboardProps) => {
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
  const isDisabled = allowance <= 0 || hasUserGuessedCorrectly || isLoadingGame ? true : false;

  return (
    <Stack component="section" sx={{ justifyContent: "center", gap: 0.5 }}>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        {ROW1.map(letter => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            color="neutral"
            disabled={isDisabled}
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
            disabled={isDisabled}
            sx={lettersSize}
          >
            {letter}
          </Button>
        ))}
      </Stack>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        <Button onClick={handleDelete} color="neutral" disabled={isDisabled || guess.length <= 0} sx={actionsSize}>
          Delete
        </Button>
        {ROW3.map(letter => (
          <Button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            color="neutral"
            disabled={isDisabled}
            sx={lettersSize}
          >
            {letter}
          </Button>
        ))}
        <Button
          onClick={() =>
            handleSubmitGuess(allowance, () => {
              setGuess("");
            })
          }
          color="success"
          disabled={isDisabled || guess.length < 5}
          loading={isLoadingGame}
          sx={{ ...actionsSize, bgcolor: "success.700" }}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
