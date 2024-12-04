export const WordleGameABI = [
  {
    constant: false,
    inputs: [{ name: "userGuess", type: "string" }],
    name: "guess",
    outputs: [],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "guessFee",
    outputs: [{ name: "", type: "uint256" }],
    type: "function"
  }
];
