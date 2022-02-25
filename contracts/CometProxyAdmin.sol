// SPDX-License-Identifier: XXX ADD VALID LICENSE
pragma solidity ^0.8.11;

import "./CometConfiguration.sol";
import "./CometStorage.sol";
import "./vendor/proxy/ProxyAdmin.sol";
// import "./vendor/proxy/TransparentUpgradeableProxy.sol";
import "./interfaces/ITransparentUpgradeableProxy.sol";
import "./Configurator.sol";

contract CometProxyAdmin is ProxyAdmin {

    /**
     * @dev Deploy and upgrade the implementation of the proxy.
     *
     * Requirements:
     *
     * - This contract must be the admin of `cometProxy`.
     */
    function deployAndUpgradeTo(address configuratorProxy, address cometProxy) public virtual onlyOwner {
        // Call configurator as governor instead of ProxyAdmin
        // (bool success, bytes memory data) = configuratorProxy.delegatecall(abi.encodeWithSignature("deploy()"));
        // require(success, "failed to deploy contract");
        // require(owner() == msg.sender, "COMETPROXYADMIN: caller is not the owner");

        // (address newCometImpl) = abi.decode(data, (address)); 
        // revert("past decoding");

        // address newCometImpl = Configurator(configuratorProxy).deploy();

        (bool success, bytes memory result) = configuratorProxy.delegatecall(abi.encodePacked(bytes4(keccak256(bytes("getInt()")))));
        // DELEGATE CALL DOESN'T MAKE SENSE HERE?
        // emit AddedValuesByDelegateCall(a, b, success);
        uint newCometImpl = abi.decode(result, (uint));

        // ITransparentUpgradeableProxy(cometProxy).upgradeTo(newCometImpl); // XXX use interface?
    }
}