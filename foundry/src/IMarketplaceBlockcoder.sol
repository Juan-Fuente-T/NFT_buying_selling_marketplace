// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
interface IMarketplaceBlockcoder {
    function upgradeToAndCall(address, bytes calldata) external payable;

    function proxiableUUID() external view returns (bytes32);

    function createSellOffer(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price,
        uint256 _deadline
    ) external;

    function acceptSellOffer(uint256 _sellOfferIdCounter) external payable;

    function cancelSellOffer(uint256 _sellOfferIdCounter) external;

    function createBuyOffer(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _deadline
    ) external payable;

    function acceptBuyOffer(uint256 _buyOfferIdCounter) external;

    function cancelBuyOffer(uint256 _buyOfferIdCounter) external;

    function sellOfferIdCounter() external view returns (uint256);

    function buyOfferIdCounter() external view returns (uint256);

    function owner() external view returns (address);

    function marketplaceName() external view returns (string memory);

    function initialize(string calldata _marketplaceName) external;

    function getSellOffer(uint256 offerId) external view returns (address, address, uint256, uint256, bool);
    
    function getBuyOffer(uint256 offerId) external view returns (address, address, uint256, uint256, bool);    
}