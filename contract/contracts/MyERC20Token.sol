// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";


contract MyERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("WordleToken", "WORD") {
        _mint(msg.sender, initialSupply);
    }
}
