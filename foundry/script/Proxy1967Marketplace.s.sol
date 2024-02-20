// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "../lib/forge-std/src/Script.sol";
import "../src/MarketplaceBlockcoder.sol";
import "../src/Proxy1967Marketplace.sol";

//es necesario agregar el RPC_URl y la ETHERSCAN_API_KEY AL foundry.toml

//contract Proxy1967UUPSScript is Script {
contract MyScript is Script {
    function setUp() public {}

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        //vm.broadcast();
        MarketplaceBlockcoder marketplace = new MarketplaceBlockcoder();
        Proxy1967Marketplace proxy = new Proxy1967Marketplace(
            address(marketplace),
            abi.encodeWithSignature("initialize()")
        );

        vm.stopBroadcast();
    }
}
