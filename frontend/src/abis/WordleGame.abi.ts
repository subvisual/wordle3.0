export const WordleGameABI = [
  {
    type: "constructor",
    inputs: [{ name: "_token", type: "address", internalType: "contract WordleToken" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "GUESS_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "guess",
    inputs: [{ name: "userGuess", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "guesses",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract WordleToken" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "GuessMade",
    inputs: [
      { name: "player", type: "address", indexed: true, internalType: "address" },
      { name: "guess", type: "string", indexed: false, internalType: "string" },
      { name: "isCorrect", type: "bool", indexed: false, internalType: "bool" }
    ],
    anonymous: false
  }
];
