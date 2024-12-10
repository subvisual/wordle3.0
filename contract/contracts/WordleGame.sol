// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WordleToken.sol";

contract WordleGame {
    address public token;
    string private constant FIXED_WORD = "APPLE";
    uint256 public constant GUESS_FEE = 10 * 10 ** 18;

    event GuessMade(address indexed player, string guess, bool isCorrect);

    mapping (string => bool) public guesses;

    constructor(address _token) {
        token = _token;
    }

    function guess(string memory userGuess) public returns (bool) {
        require(bytes(userGuess).length == 5, "Guess must be 5 letters long");
        require(IERC20(token).balanceOf(msg.sender) > GUESS_FEE, "Insufficient tokens");

        IERC20(token).transferFrom(msg.sender, address(this), GUESS_FEE);

        bool isCorrect = keccak256(abi.encodePacked(userGuess)) == keccak256(abi.encodePacked(FIXED_WORD));
        emit GuessMade(msg.sender, userGuess, isCorrect);
        guesses[userGuess] = isCorrect;
        return isCorrect;
    }
}
