// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract WordleGameTest is Test {
    WordleToken public token;
    WordleGame public game;

    address public player;

    function setUp() public {
        token = new WordleToken(1000 * 10 ** 18);
        game = new WordleGame(token);
        player = address(0x123);
        token.transfer(player, 100 * 10 ** 18);
        vm.prank(player);
        token.approve(address(game), type(uint256).max);
    }

    function testCorrectGuess() public {
        uint256 initialBalance = token.balanceOf(player);

        vm.prank(player);
        game.guess("APPLE");

        uint256 expectedBalance = initialBalance - 10 * 10 ** 18;
        uint256 finalBalance = token.balanceOf(player);

        assertEq(finalBalance, expectedBalance, "Player's balance should decrease by the fee");
    }

    function testIncorrectGuess() public {
        uint256 initialBalance = token.balanceOf(player);

        vm.prank(player);
        game.guess("WRONG");

        uint256 expectedBalance = initialBalance - 10 * 10 ** 18;
        uint256 finalBalance = token.balanceOf(player);

        assertEq(finalBalance, expectedBalance, "Player's balance should decrease by the fee");
    }
}
