// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyERC20Token.sol";

contract WordleGame {
    MyERC20Token public token;
    string private fixedWord;
    uint256 public constant guessFee = 1 * 10 ** 18;

    event GuessMade(address indexed player, string guess, bool isCorrect);

    constructor(MyERC20Token _token, string memory _fixedWord) {
        token = _token;
        fixedWord = _fixedWord;
    }

    function guess(string memory userGuess) public {
        require(bytes(userGuess).length == 5, "Guess must be 5 letters long");
        require(token.transferFrom(msg.sender, address(this), guessFee), "Token transfer failed");

        bool isCorrect = keccak256(abi.encodePacked(userGuess)) == keccak256(abi.encodePacked(fixedWord));
        emit GuessMade(msg.sender, userGuess, isCorrect);
    }
}
