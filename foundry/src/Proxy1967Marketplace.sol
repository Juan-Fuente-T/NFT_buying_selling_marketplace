// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
//import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../node_modules/@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Proxy1967Marketplace is ERC1967Proxy {
    constructor(
        address MarkeplaceBlockcoder,
        bytes memory _data
    ) ERC1967Proxy(MarkeplaceBlockcoder, _data) {}
}


