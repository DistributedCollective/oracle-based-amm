// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// minimalistic harness for fuzzing with Echidna over RBTCWrapperProxy.
// NOTE: STILL not run; in the next step we will load the bytecode
// of the proxy at a fixed address via echidna.yaml (deployBytecodes).

contract RBTCWrapperProxyHarness {
    // Fixed address where we will "mount" the runtime of the proxy (next step).
    address constant PROXY_ADDR = 0xBEEF00000000000000000000000000000000BEEf;

    // ---------- Secure reading utilities (do not break if no code) ----------
    function _getRegistry() internal view returns (address reg, bool ok) {
        bytes memory ret;
        (ok, ret) = PROXY_ADDR.staticcall(
            abi.encodeWithSignature("registry()")
        );
        if (ok && ret.length == 32) reg = abi.decode(ret, (address));
    }

    function _getOnlyOwnerFlag() internal view returns (bool flag, bool ok) {
        bytes memory ret;
        (ok, ret) = PROXY_ADDR.staticcall(
            abi.encodeWithSignature("onlyOwnerCanUpdateRegistry()")
        );
        if (ok && ret.length == 32) flag = abi.decode(ret, (bool));
    }

    // ---------- Actions that Echidna can combine in sequences ----------
    function act_updateRegistry() external {
        // Read state before
        (address beforeReg, ) = _getRegistry();

        // Call low-level (no reverts if no code; simply ok=false or ret empty)
        (bool ok, ) = PROXY_ADDR.call(
            abi.encodeWithSignature("updateRegistry()")
        );

        // Read state after
        (address afterReg, ) = _getRegistry();

        // If the call succeeded, the registry must change to a non-zero value;
        // otherwise it should remain as before.
        if (ok) {
            require(afterReg != address(0), "registry set to zero");
            require(afterReg != beforeReg, "registry unchanged after success");
        } else {
            require(afterReg == beforeReg, "registry changed on failed call");
        }
    }

    function act_restrictRegistryUpdate(bool flag) external {
        (bool beforeFlag, ) = _getOnlyOwnerFlag();

        (bool ok, ) = PROXY_ADDR.call(
            abi.encodeWithSignature("restrictRegistryUpdate(bool)", flag)
        );

        (bool afterFlag, ) = _getOnlyOwnerFlag();

        // If the call succeeded, the flag should remain as requested; if not, it should remain unchanged.
        if (ok) {
            require(afterFlag == flag, "flag not set after success");
        } else {
            require(afterFlag == beforeFlag, "flag changed on failed call");
        }
    }

    // ---------- Minimum property required by Echidna ----------
    // Properties are functions without arguments that return bool and start with "echidna".
    function echidna_dummy_property() public pure returns (bool) {
        return true;
    }
}
