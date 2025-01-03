// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract Deploy is Script {
	function run() external {
		// Load environment variables
		uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
		address playerAddress = vm.envAddress("PUBLIC_KEY");

		// Start broadcasting transactions
		vm.startBroadcast(deployerPrivateKey);

		// Deploy the WordleToken contract
		WordleToken token = new WordleToken(1000 * 10 ** 18);
		console.log("Wordle Token deployed at:", address(token));

		// Deploy the WordleGame contract
		WordleGame game = new WordleGame(address(token));
		console.log("Wordle Game deployed at:", address(game));

		// Transfer tokens to the user's address
		token.transfer(playerAddress, 10 * 10 ** 18);
		console.log("100 tokens transferred to user address:", playerAddress);

		vm.stopBroadcast();
	}
}
