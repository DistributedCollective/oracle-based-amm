// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SmokeInvariant {
    function invariant_always_true() public pure {
        assert(true);
    }
}
