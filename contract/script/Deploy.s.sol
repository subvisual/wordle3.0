// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WordleToken token = new WordleToken(1000 * 10 ** 18);
        console.log("WordleToken deployed at:", address(token));
        WordleGame game = new WordleGame(token);
        console.log("WordleGame deployed at:", address(game));

        vm.stopBroadcast();
    }
}
