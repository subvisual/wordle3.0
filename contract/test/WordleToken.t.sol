// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/WordleToken.sol";

contract WordleTokenTest is Test {
    WordleToken public token;
    address public owner;
    address public spender;

    function setUp() public {
        token = new WordleToken(1000 * 10 ** 18);
        owner = address(this);
        spender = address(0x123);

        token.transfer(spender, 10 * 10 ** 18);
    }

    function testApproveTokens() public {
        vm.prank(spender);
        bool success = token.approve(owner, 10 * 10 ** 18);
        assertTrue(success, "Approval should succeed");

        uint256 allowance = token.allowance(spender, owner);
        assertEq(allowance, 10 * 10 ** 18, "Allowance should match approved amount");
    }

    function testCheckAllowance() public {
        vm.prank(spender);
        token.approve(owner, 10 * 10 ** 18);

        uint256 allowance = token.allowance(spender, owner);
        assertEq(allowance, 10 * 10 ** 18, "Allowance should be as set");
    }
}
