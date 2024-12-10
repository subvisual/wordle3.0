// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract Deploy is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address playerAddress = vm.envAddress("PLAYER_ADDRESS");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the WordleToken contract
        WordleToken token = new WordleToken(1000 * 10 ** 18);
        console.log("WordleToken deployed at:", address(token));

        // Deploy the WordleGame contract
        WordleGame game = new WordleGame(address(token));
        console.log("WordleGame deployed at:", address(game));
        
        // Transfer tokens to the user's address
        token.transfer(playerAddress, 100 * 10 ** 18);
        console.log("100 tokens transferred to user address:", playerAddress);

        vm.stopBroadcast();
    }
}
