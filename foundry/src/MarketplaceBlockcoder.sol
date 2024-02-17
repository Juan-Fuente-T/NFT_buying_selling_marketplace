// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

//import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {UUPSUpgradeable} from "../node_modules/@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IERC721} from "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Initializable} from "../node_modules/@openzeppelin/contracts/proxy/utils/Initializable.sol";

////////////////////////////////////////////////////////////
///               Marketplace Blockcoder                 ///
////////////////////////////////////////////////////////////

/**l comando
 * @title MarketplaceBlockcoder
 * @dev A decentralized marketplace contract for NFTs, allowing users to create and accept sell offers.
 */
contract MarketplaceBlockcoder is UUPSUpgradeable, Initializable {
    ////////////////////////////////////////////////////////////////
    ///                       Variables                          ///
    ////////////////////////////////////////////////////////////////

    struct Offer {
        // Struct whit data of sellOffers and buyOffers
        address nftAddress; //la dirección del contrato NFT de la oferta
        address offerer; //la dirección que ha creado la oferta
        uint256 tokenId; //el id del NFT de la oferta
        uint256 price; //el precio en ETH de la oferta
        uint256 deadline; //la fecha máxima para la cual la oferta se podrá aceptar
        bool isEnded; // booleano que indicará si la oferta ya ha sido aceptada, o si la oferta ha sidocancelada
    }
    Offer public offer; //declaración de una oferta de tipo Offer(struct)

    uint256 public sellOfferIdCounter; //contador de oferta de venta
    uint256 public buyOfferIdCounter; //contador de ofertas de compra
    address public owner; //dirección del owner del contrato y del proxy
    string public marketplaceName; //nombre del marketplace

    mapping(uint256 => Offer) public sellOffers; //mapeo de un identificador con ofertas de venta
    mapping(uint256 => Offer) public buyOffers; //mapeo de un identificador con ofertas de compra

    ////////////////////////////////////////////////////////////////
    ///                        Events                            ///
    ////////////////////////////////////////////////////////////////

    // Events to track offer-related activities
    event NewSellOffer(
        address indexed createdBy,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        uint256 deadline,
        uint256 indexed sellOfferIdCounter
    );
    event NewBuyOffer(
        address indexed createdBy,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        uint256 deadline,
        uint256 indexed buyOfferIdCounter
    );
    event SellOfferAccepted(
        uint indexed sellOfferIdCounter,
        address indexed acceptedBy
    );
    event BuyOfferAccepted(
        uint256 indexed buyOfferIdCounter,
        address indexed acceptedBy
    );
    event SellOfferCancelled(
        uint256 indexed sellOfferIdCounter,
        address indexed cancelledBy
    );
    event BuyOfferCancelled(
        uint256 indexed buyOfferIdCounter,
        address indexed cancelledBy
    );

    ////////////////////////////////////////////////////////////////
    ///                          Errors                          ///
    ////////////////////////////////////////////////////////////////

    // Error messages for different scenarios
    error TransferFailed();
    error InvalidAddress();
    error OfferNotExist();
    error InsufficientDeadline();
    error InsufficientValue();
    error YouAreNotOwner();
    error OfferHasExpired();
    error OfferNotExpired();

    ////////////////////////////////////////////////////////////////
    ///                Functions for Implementation              ///
    ////////////////////////////////////////////////////////////////

    /**
     * @dev Modifier to ensure that only the owner can execute certain functions
     */

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract's owner can call this method"
        );
        _;
    }
    /**
     * @dev Function to initialize the proxy.
     * @param _marketplaceName The Name of the marketplace
     * @notice With the initialize we don´t need constructor
     * @notice that is the owner of the proxy, not this implementation
     */
    function initialize(string memory _marketplaceName) external initializer {
        owner = msg.sender;
        marketplaceName = _marketplaceName;
    }

    /**
     * @dev Internal function to authorize the upgrade of the implementation contract.
     * @param newImplementation The address of the new implementation contract.
     * @notice You can add any authorization logic for the upgrade of the implementation.
     *         It´s limit by the modifier only to the owner.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        // Posible lógica de autorización para la actualización de la implementación
    }

    ////////////////////////////////////////////////////////////////
    ///             Helper functions to recover data             ///
    ////////////////////////////////////////////////////////////////

    /**
     * @dev Retrieves the details of a sell offer.
     * @param offerId The ID of the sell offer.
     * @return nftAddress The address of the NFT contract associated with the offer.
     * @return offerer The address of the offer creator.
     * @return tokenId The ID of the NFT being offered.
     * @return price The price of the offer in ETH.
     * @return deadline The specific time or date by which the offer must be accepted.
     * @return isEnded A boolean indicating whether the offer has ended.
     */

    function getSellOffer(
        uint256 offerId
    ) public view returns (address, address, uint256, uint256, uint256, bool) {
        return (
            sellOffers[offerId].nftAddress,
            sellOffers[offerId].offerer,
            sellOffers[offerId].tokenId,
            sellOffers[offerId].price,
            sellOffers[offerId].deadline,
            sellOffers[offerId].isEnded
        );
    }

    /**
     * @dev Retrieves the details of a buy offer.
     * @param offerId The ID of the buy offer.
     * @return nftAddress The address of the NFT contract associated with the offer.
     * @return offerer The address of the offer creator.
     * @return tokenId The ID of the NFT being offered.
     * @return price The price of the offer in ETH.
     * @return deadline The specific time or date by which the offer must be accepted.
     * @return isEnded A boolean indicating whether the offer has ended.
     */

    function getBuyOffer(
        uint256 offerId
    ) public view returns (address, address, uint256, uint256, uint256, bool) {
        return (
            buyOffers[offerId].nftAddress,
            buyOffers[offerId].offerer,
            buyOffers[offerId].tokenId,
            buyOffers[offerId].price,
            buyOffers[offerId].deadline,
            buyOffers[offerId].isEnded
        );
    }

    ////////////////////////////////////////////////////////////////
    ///                     Functions to SELL                    ///
    ////////////////////////////////////////////////////////////////

    /**
     * @dev Function to create sell offers for NFTs.
     * @param _nftAddress The address of the NFT contract.
     * @param _tokenId The ID of the NFT to be offered for sale.
     * @param _price The price in ETH for the sell offer.
     * @param _deadline The deadline for accepting the sell offer.
     * @notice Ensure that the provided NFT address and token ID are valid.
     * @notice Ensure that the deadline is set in the future.
     */

    function createSellOffer(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price,
        uint256 _deadline
    ) public {
        ///////////////////////////CHECKS/////////////////////7//////////////

        if (_price == 0) {
            revert InsufficientValue();
        }
        if (IERC721(_nftAddress).ownerOf(_tokenId) != msg.sender) {
            revert YouAreNotOwner();
        }
        if (block.timestamp >= _deadline) {
            revert InsufficientDeadline();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        sellOffers[sellOfferIdCounter] = Offer(
            _nftAddress,
            msg.sender,
            _tokenId,
            _price,
            _deadline,
            false
        );

        sellOfferIdCounter++;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        IERC721(_nftAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        //-1 porque si tiene que ir despues de aumentar el contador, el contador estara falseado en el emit
        emit NewSellOffer(
            msg.sender,
            _nftAddress,
            _tokenId,
            _price,
            _deadline,
            sellOfferIdCounter - 1
        );
    }

    /**
     * @dev Function to accept sell offers.
     * @param _sellOfferIdCounter The identifier of the sell offer to be accepted.
     * @notice Ensure that the sender send sufficient value with their transaction to cover the asking price of the NFT.
     * @notice ESnsure that the sell offer is valid and not already ended.
     * @notice Ensure that the deadline for the sell offer has not passed.
     */

    function acceptSellOffer(uint256 _sellOfferIdCounter) public payable {
        uint256 idCounter = _sellOfferIdCounter;

        //////////////////////////// CHECKS  ///////////////////////////////////

        if (sellOffers[idCounter].isEnded) {
            revert OfferNotExist();
        }
        if (sellOffers[idCounter].deadline <= block.timestamp) {
            revert OfferHasExpired();
        }
        if (msg.value < sellOffers[idCounter].price) {
            revert InsufficientValue();
        }
        if (msg.sender == address(0)) {
            revert InvalidAddress();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        sellOffers[idCounter].isEnded = true;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        IERC721(sellOffers[idCounter].nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            sellOffers[idCounter].tokenId
        );

        (bool ok, ) = (payable(sellOffers[idCounter].offerer)).call{
            value: msg.value
        }("");
        if (!ok) {
            revert TransferFailed();
        }
        emit SellOfferAccepted(idCounter, msg.sender);
    }

    /**
     * @dev Function to cancel sell offers.
     * @param _sellOfferIdCounter The identifier of the sell offer to be cancelled.
     * @notice Ensure that the sell offer is not already ended.
     * @notice Ensure that the sender is the owner of the sell offer.
     * @notice Ensure that the deadline for the sell offer has not passed.
     */
    function cancelSellOffer(uint256 _sellOfferIdCounter) public {
        uint256 idCounter = _sellOfferIdCounter;

        //////////////////////////// CHECKS ///////////////////////////////////

        if ((sellOffers[idCounter]).isEnded) {
            revert OfferNotExist();
        }
        if (sellOffers[idCounter].offerer != msg.sender) {
            revert YouAreNotOwner();
        }
        if (sellOffers[idCounter].deadline > block.timestamp) {
            revert OfferNotExpired();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        sellOffers[idCounter].isEnded = true;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        IERC721(sellOffers[idCounter].nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            sellOffers[idCounter].tokenId
        );
        emit SellOfferCancelled(idCounter, msg.sender);
    }

    ////////////////////////////////////////////////////////////////
    ///                     Functions to BUY                     ///
    ////////////////////////////////////////////////////////////////

    /**
     * @dev Function to create buy offers for NFTs.
     * @param _nftAddress The address of the NFT contract.
     * @param _tokenId The ID of the NFT to be offered for purchase.
     * @param _deadline The deadline for accepting the buy offer.
     * @notice Ensure that the provided NFT address and token ID are valid.
     * @notice Ensure that the deadline is set in the future.
     * @notice Ensure that a valid amount of Ether is sent with the transaction.
     */

    function createBuyOffer(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _deadline
    ) public payable {
        //////////////////////////// CHECKS ///////////////////////////////////

        if (block.timestamp >= _deadline) {
            revert InsufficientDeadline();
        }
        if (!(msg.value > 0)) {
            revert InsufficientValue();
        }
        if (msg.sender == address(0)) {
            revert InvalidAddress();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        buyOffers[buyOfferIdCounter] = Offer(
            _nftAddress,
            msg.sender,
            _tokenId,
            msg.value,
            _deadline,
            false
        );

        buyOfferIdCounter++;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        //-1 porque si tiene que ir despues de aumentar el contador, el contador estara falseado en el emit
        emit NewBuyOffer(
            msg.sender,
            _nftAddress,
            _tokenId,
            msg.value,
            _deadline,
            buyOfferIdCounter - 1
        );
    }

    /**
     * @dev Function to accept buy offers.
     * @param _buyOfferIdCounter The identifier of the buy offer to be accepted.
     * @notice Ensure that the sender is the owner of the NFT being offered.
     * @notice Ensure that the buy offer is valid and not already ended.
     * @notice Ensure that the deadline for the buy offer has not passed.
     */

    function acceptBuyOffer(uint256 _buyOfferIdCounter) public {
        uint256 idCounter = _buyOfferIdCounter;

        //////////////////////////// CHECKS ///////////////////////////////////

        if (buyOffers[idCounter].isEnded) {
            revert OfferNotExist();
        }
        if (
            IERC721(buyOffers[idCounter].nftAddress).ownerOf(
                buyOffers[idCounter].tokenId
            ) != msg.sender
        ) {
            revert YouAreNotOwner();
        }
        if (buyOffers[idCounter].deadline <= block.timestamp) {
            revert OfferHasExpired();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        buyOffers[idCounter].isEnded = true;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        IERC721(buyOffers[idCounter].nftAddress).safeTransferFrom(
            msg.sender,
            buyOffers[idCounter].offerer,
            buyOffers[idCounter].tokenId
        );

        (bool ok, ) = payable(msg.sender).call{
            value: buyOffers[idCounter].price
        }("");
        if (!ok) {
            revert TransferFailed();
        }

        emit BuyOfferAccepted(idCounter, msg.sender);
    }

    /**
     * @dev Function to cancel buy offers.
     * @param _buyOfferIdCounter The identifier of the buy offer to be cancelled.
     * @notice Ensure that the buy offer is not already ended.
     * @notice Ensure that the sender is the owner of the buy offer.
     * @notice Ensure that the deadline for the buy offer has not passed.
     */
    function cancelBuyOffer(uint256 _buyOfferIdCounter) public {
        //////////////////////////// CHECKS ///////////////////////////////////

        if (buyOffers[_buyOfferIdCounter].isEnded) {
            revert OfferNotExist();
        }
        if (msg.sender != buyOffers[_buyOfferIdCounter].offerer) {
            revert YouAreNotOwner();
        }
        if (buyOffers[_buyOfferIdCounter].deadline > block.timestamp) {
            revert OfferNotExpired();
        }

        //////////////////////////// EFFECTS ///////////////////////////////////

        buyOffers[_buyOfferIdCounter].isEnded = true;

        //////////////////////////// INTERACTIONS ///////////////////////////////////

        (bool ok, ) = payable(msg.sender).call{
            value: buyOffers[_buyOfferIdCounter].price
        }("");
        if (!ok) {
            revert TransferFailed();
        }
        emit BuyOfferCancelled(_buyOfferIdCounter, msg.sender);
    }

    ////////////////////////////////////////////////////////////////
    ///                   Reception Functions                    ///
    ////////////////////////////////////////////////////////////////

    /**
     * @dev Allows the contract to receive an NFT.
     * This function can be called to handle the reception of Non-Fungible Tokens (NFTs).
     * Implement custom logic within the function body to process the received NFT as needed.
     *
     * Emits no events by default. Any additional actions or events related to the received NFT
     * should be specified within the function's implementation.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        // Devolver la firma esperada para indicar que la recepción fue exitosa
        return this.onERC721Received.selector;
    }

    /**
     * @dev This function is executed when the contract receives Ether without accompanying data.
     * @notice Ether sent with this transaction is added to the contract's balance.
     */
    receive() external payable {
        // No specific logic required for receiving Ether in this contract.
        // The received Ether is added to the contract's balance.
    }

    /**
     * @dev Fallback function executed when no other function matches the provided function signature,
     * or when no data is provided with the transaction.
     * @notice This function allows the contract to receive Ether and does not contain specific logic.
     * @notice Ether sent with this transaction is added to the contract's balance.
     */
    fallback() external payable {
        // No specific logic required in the fallback function.
        // The received Ether is added to the contract's balance.
        // Users should avoid relying on the fallback function for complex interactions.
    }
}
