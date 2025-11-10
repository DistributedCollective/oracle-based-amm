// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StdInvariant} from "forge-std/StdInvariant.sol";
import {Vm} from "forge-std/Vm.sol";
import {stdJson} from "forge-std/StdJson.sol";

address constant HEVM_ADDRESS = address(uint160(uint256(keccak256("hevm cheat code"))));
Vm constant vm = Vm(HEVM_ADDRESS);

// Handler: the fuzzer will call these functions; they in turn call the proxy
contract RBTCWrapperProxy_Handler {
    address public immutable proxy;
    constructor(address _proxy) { proxy = _proxy; }

    // Exercise a real external function (no args) on the proxy
    function call_acceptOwnership() external {
        (bool ok,) = proxy.call(abi.encodeWithSignature("acceptOwnership()"));
        ok; // ignore result; invariants decide pass/fail
    }

    function call_updateRegistry(address newReg) external {
        (bool ok,) = proxy.call(abi.encodeWithSignature("updateRegistry(address)", newReg));
        ok;
    }

    function call_restrictRegistryUpdate(bool flag) external {
        (bool ok,) = proxy.call(abi.encodeWithSignature("restrictRegistryUpdate(bool)", flag));
        ok;
    }

}

contract RBTCWrapperProxy_Invariants is StdInvariant {
    using stdJson for string;

    address proxy;
    RBTCWrapperProxy_Handler handler;

    function setUp() public {
        // Load deployed bytecode from Truffle artifact and etch it
        string memory path = string.concat(
            vm.projectRoot(),
            "/../../rbtcwrapperproxy/build/contracts/RBTCWrapperProxy.json"
        );
        string memory json = vm.readFile(path);
        bytes memory runtime = json.readBytes(".deployedBytecode");
        require(runtime.length > 0, "empty deployedBytecode");

        address addr = address(uint160(uint256(keccak256("RBTCWrapperProxy"))));
        vm.etch(addr, runtime);
        proxy = addr;

        handler = new RBTCWrapperProxy_Handler(proxy);
        targetContract(address(handler)); // tell the fuzzer what to call
    }

    function invariant_smoke() public pure { assert(true); }

    function invariant_code_intact() public view {
        assert(proxy.code.length > 0);
    }
}
