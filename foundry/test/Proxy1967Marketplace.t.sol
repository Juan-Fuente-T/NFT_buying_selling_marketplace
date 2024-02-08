// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {Test, console, console2} from "../lib/forge-std/src/Test.sol";
import {Proxy1967Marketplace} from "../src/Proxy1967Marketplace.sol";
import {MarketplaceBlockcoder} from "../src/MarketplaceBlockcoder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IMarketplaceBlockcoder {
    function upgradeToAndCall(address, bytes memory) external payable;

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

    function initialize(string memory _marketplaceName) external;

    function getSellOffer(uint256 offerId) external view returns (address, address, uint256, uint256, bool);
    
    function getBuyOffer(uint256 offerId) external view returns (address, address, uint256, uint256, bool);

     
}

contract TestERC721 is ERC721 {
    constructor() ERC721("TestNFT", "TNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract Proxy1967MarketplaceTest is Test {
    /*struct Offer {
        address nftAddress; //la dirección del contrato NFT de la oferta
        address offerer; //la dirección que ha creado la oferta
        uint256 tokenId; //el id del NFT de la oferta
        uint256 price; //el precio en ETH de la oferta
        uint256 deadline; //la fecha máxima para la cual la oferta se podrá aceptar
        bool isEnded; // booleano que indicará si la oferta ya ha sido aceptada, o si la oferta ha sidocancelada
    } */

    address offerer; //la dirección que ha creado la oferta
    uint256 tokenId; //el id del NFT de la oferta
    uint256 price; //el precio en ETH de la oferta
    uint256 deadline; //la fecha máxima para la cual la oferta se podrá aceptar
    bool isEnded;// booleano que indicará si la oferta ya ha sido aceptada, o si la oferta ha sidocancelada}
    address nftAddress; //la dirección del contrato NFT de la oferta
    address alice;
    address bob;
    address carol;

    uint256 sepoliaFork;
    string SEPOLIA_RPC_URL = vm.envString("SEPOLIA_RPC_URL");
    TestERC721 public nft;
    Proxy1967Marketplace public proxy;
    MarketplaceBlockcoder public marketplace;
    MarketplaceBlockcoder public marketplaceV2;

    event NewSellOffer(
        uint256 indexed sellOfferIdCounter,
        address indexed createdBy
    );

    event NewBuyOffer(
        uint256 indexed buyOfferIdCounter,
        address indexed createdBy
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

    error CallFailed();

    ////////////////////////////////////////////////////////////////
    ///                         SETUP                            ///
    ////////////////////////////////////////////////////////////////

    function setUp() public {
        vm.createSelectFork(SEPOLIA_RPC_URL);
        assertEq(vm.activeFork(), sepoliaFork);
        marketplace = new MarketplaceBlockcoder();
        marketplaceV2 = new MarketplaceBlockcoder();

        proxy = new Proxy1967Marketplace(
            address(marketplace),
            abi.encodeWithSignature(
                "initialize(string)",
                "Marketplace BlockCoder"
            )
        );
        nft = new TestERC721();
       
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        carol = makeAddr("carol");
        nft.mint(alice, 1);
        nft.mint(alice, 2);
        nft.mint(alice, 3);
        nft.mint(alice, 4);
    }

    ////////////////////////////////////////////////////////////////
    ///                   test Miscelanea                    ///
    ////////////////////////////////////////////////////////////////

    function testInitialize() public {
       // IMarketplaceBlockcoder(address(proxy)).initialize("Marketplace BlockCoder");
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).marketplaceName(),
            "Marketplace BlockCoder"
        );
        assertEq(IMarketplaceBlockcoder(address(proxy)).owner(), address(this));
        vm.expectRevert(abi.encodeWithSignature("InvalidInitialization()"));
        IMarketplaceBlockcoder(address(proxy)).initialize("Marketplace_BlockCoder");

    }

    function testUpgradeToAndCall() public{
        IMarketplaceBlockcoder(address(proxy)).upgradeToAndCall(address(marketplaceV2), "");
 }

    function testReceive() public{
        (bool success,) = address(proxy).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(address(proxy).balance, 1 ether);
    }

    function testFallback() public{
        (bool success,) = address(proxy).call{value: 1 ether}(abi.encodeWithSignature("fallBackTest()"));
        assertTrue(success);
        assertEq(address(proxy).balance, 1 ether);
    }

    function testOnERC721Received() public {
        startHoax(alice);
        assertEq(nft.ownerOf(1),alice);
        nft.approve(address(proxy), 1);
        nft.safeTransferFrom(alice, address(proxy), 1);
        assertEq(nft.ownerOf(1),(address(proxy)));
    }
    ////////////////////////////////////////////////////////////////
    ///                   testCreateSaleOffer                    ///
    ////////////////////////////////////////////////////////////////

    function testCreateSellOffer() public {
        startHoax(alice, 1 ether);

        /////////////SELL OFFER 0//////////////
        nft.approve(address(proxy), 1);
        assertEq(nft.getApproved(1), address(proxy));
        vm.expectEmit();
        emit NewSellOffer(0, alice);
        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            1,
            0.001 ether,
            block.timestamp + 1800
        );
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
        assertEq(nft.ownerOf(1), address(proxy));
        assertEq(IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(), 1);
        (nftAddress, offerer, tokenId, price, isEnded) = IMarketplaceBlockcoder(address(proxy)).getSellOffer(0);
        assertEq(nftAddress,  address(nft));
        assertEq(offerer, alice);
        assertEq(tokenId, 1);
        assertEq(price, 0.001 ether);
        assertEq(isEnded, false);

        /////////////ERROR1 SELL OFFER 1//////////////

        nft.approve(address(proxy), 2);
        vm.expectRevert(abi.encodeWithSignature("InsufficientDeadline()"));
        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            2,
            0.001 ether,
            1706551000
        );
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            1
        );

        /////////////ERROR2 SELL OFFER 1//////////////
        nft.approve(address(proxy), 2);
        vm.expectRevert(abi.encodeWithSignature("InsufficientValue()"));
        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            2,
            0,
            block.timestamp + 1000
        );

        /////////////ERROR3 SELL OFFER 1//////////////
        nft.approve(address(proxy), 2);
        vm.startPrank(bob);
        vm.expectRevert(abi.encodeWithSignature("YouAreNotOwner()"));
        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            2,
            0.0001 ether,
            block.timestamp + 1000
        );
    }

    ////////////////////////////////////////////////////////////////
    ///                   testAcceptSaleOffer                    ///
    ////////////////////////////////////////////////////////////////

    function testAcceptSellOffer() public {
        startHoax(alice, 1 ether);

        /////////////SELL OFFER 0//////////////
        assertEq(nft.ownerOf(1), alice);
        nft.approve(address(proxy), 1);
        assertEq(nft.getApproved(1), address(proxy));

        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            1,
            0.1 ether,
            block.timestamp + 100
        );

        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
        assertNotEq(nft.ownerOf(1), alice);
        assertEq(nft.ownerOf(1), address(proxy));

        /////////////SELL OFFER 1//////////////
        nft.approve(address(proxy), 2);
        assertEq(nft.getApproved(2), address(proxy));

        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            2,
            0.2 ether,
            block.timestamp + 3600
        );
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            2,
            "No se ha creado la Offer"
        );
        assertEq(nft.ownerOf(2), address(proxy));

        /////////////SELL OFFER 2//////////////
        nft.approve(address(proxy), 3);

        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            3,
            0.3 ether,
            block.timestamp + 3600
        );

        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            3,
            "No se ha creado la Offer"
        );
        assertEq(nft.ownerOf(3), address(proxy));

        /////////////SELL OFFER 3//////////////
        nft.approve(address(proxy), 4);

        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            4,
            0.4 ether,
            block.timestamp + 1 days
        );

        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            4,
            "No se ha creado la Offer"
        );
        assertEq(nft.ownerOf(4), address(proxy));

        /////////////CANCEL SELL OFFER 0//////////////
        vm.warp(block.timestamp + 110);
        IMarketplaceBlockcoder(address(proxy)).cancelSellOffer(0);
        assertEq(alice, nft.ownerOf(1));

        startHoax(bob, 1 ether);

        /////////////ERROR1 ACCEPT SELL OFFER 0//////////////
        vm.expectRevert(abi.encodeWithSignature("OfferNotExist()"));
        (bool ok1, ) = address(proxy).call{value: 0.1 ether}(
            abi.encodeWithSignature("acceptSellOffer(uint256)", 0)
        );
        if (!ok1) {
            revert CallFailed();
        }
        /////////////ERROR1 ACCEPT SELL OFFER 1//////////////
        vm.expectRevert(abi.encodeWithSignature("InsufficientValue()"));
        (bool ok2, ) = address(proxy).call{value: 0.001 ether}(
            abi.encodeWithSignature("acceptSellOffer(uint256)", 1)
        );
        if (!ok2) {
            revert CallFailed();
        }

        /////////////ACCEPT SELL OFFER 2//////////////
        assertEq(1 ether, bob.balance);
        assertEq(1 ether, alice.balance);
        assertEq(nft.ownerOf(3), address(proxy));
        vm.expectEmit();
        emit SellOfferAccepted(2, bob);

        (bool ok3, ) = address(proxy).call{value: 0.3 ether}(
            abi.encodeWithSignature("acceptSellOffer(uint256)", 2)
        );
        if (!ok3) {
            revert CallFailed();
        }
        assertEq(0.7 ether, bob.balance);
        assertEq(1.3 ether, alice.balance);
        assertEq(nft.ownerOf(3), bob);
        ( , , , , isEnded) = IMarketplaceBlockcoder(address(proxy)).getSellOffer(2);
        assertEq(isEnded, true);

        /////////////ERROR2 ACCEPT SELL OFFER 1//////////////
        vm.startPrank(address(0));
        vm.expectRevert(abi.encodeWithSignature("InvalidAddress()"));
        (bool ok4, ) = address(proxy).call{value: 0.2 ether}(
            abi.encodeWithSignature("acceptSellOffer(uint256)", 1)
        );
        if (!ok4) {
            revert CallFailed();
        }
        vm.stopPrank();
        /////////////ERROR ACCEPT SELL OFFER 3//////////////
        vm.warp(block.timestamp + 1 days + 1);
        vm.expectRevert(abi.encodeWithSignature("OfferHasExpired()"));
        (bool ok5, ) = address(proxy).call{value: 0.4 ether}(
            abi.encodeWithSignature("acceptSellOffer(uint256)", 3)
        );
        if (!ok5) {
            revert CallFailed();
        }
     }

    ////////////////////////////////////////////////////////////////
    ///                  testCancelSellOffer                     ///
    ////////////////////////////////////////////////////////////////

    function testCancelSellOffer() public {
        vm.startPrank(alice);
        /////////////SELL OFFER 0//////////////
        nft.approve(address(proxy), 1);
        IMarketplaceBlockcoder(address(proxy)).createSellOffer(
            address(nft),
            1,
            0.001 ether,
            block.timestamp + 1800
        );

        assertEq(
            IMarketplaceBlockcoder(address(proxy)).sellOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
      
        /////////////ERROR1 SELL OFFER 0//////////////
        vm.startPrank(bob);
        vm.expectRevert(abi.encodeWithSignature("YouAreNotOwner()"));
        IMarketplaceBlockcoder(address(proxy)).cancelSellOffer(0);

        /////////////ERROR2 SELL OFFER 0//////////////
        vm.startPrank(alice);
        vm.expectRevert(abi.encodeWithSignature("OfferNotExpired()"));
        IMarketplaceBlockcoder(address(proxy)).cancelSellOffer(0);

        /////////////CANCEL SELL OFFER 0//////////////
        vm.warp(block.timestamp + 3690);
        assertEq(nft.ownerOf(1), address(proxy));
        vm.expectEmit();
        emit SellOfferCancelled(0, alice);
        IMarketplaceBlockcoder(address(proxy)).cancelSellOffer(0);
        assertEq(nft.ownerOf(1), alice);
        ( , , , , isEnded) = IMarketplaceBlockcoder(address(proxy)).getSellOffer(0);
        assertEq(isEnded, true);

        /////////////ERROR3 SELL OFFER 0//////////////
        vm.expectRevert(abi.encodeWithSignature("OfferNotExist()"));
        IMarketplaceBlockcoder(address(proxy)).cancelSellOffer(0);
    }

    ////////////////////////////////////////////////////////////////
    ///                    testCreateBuyOffer                    ///
    ////////////////////////////////////////////////////////////////

    function testCreateBuyOffer() public payable {
        startHoax(alice, 1 ether);
        /////////////BUY OFFER 0//////////////
        assertEq(alice.balance, 1 ether);
        vm.expectEmit();
        emit NewBuyOffer(0, alice);
        (bool ok1, ) = address(proxy).call{value: 0.1 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                1,
                block.timestamp + 3600
            )
        );
        if (!ok1) {
            revert("CallFailed");
        }
        assertEq(alice.balance, 0.9 ether);


        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
        (nftAddress, offerer, tokenId, price, isEnded) = IMarketplaceBlockcoder(address(proxy)).getBuyOffer(0);
        assertEq(nftAddress,  address(nft));
        assertEq(offerer, alice);
        assertEq(tokenId, 1);
        assertEq(price, 0.1 ether);
        assertEq(isEnded, false);

        /////////////ERROR BUY OFFER 1//////////////
        vm.expectRevert(abi.encodeWithSignature("InsufficientDeadline()"));
        (bool ok2, ) = address(proxy).call{value: 0.1 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                2,
                block.timestamp
            )
        );
        if (!ok2) {
            revert("CallFailed");
        }
        /////////////ERROR2 BUY OFFER 1//////////////
        vm.expectRevert(abi.encodeWithSignature("InsufficientValue()"));
        (bool ok3, ) = address(proxy).call{value: 0}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                2,
                block.timestamp + 3600
            )
        );
        if (!ok3) {
            revert("CallFailed");
        }

        /////////////ERROR2 BUY OFFER 1//////////////
        vm.startPrank(address(0));
        vm.expectRevert(abi.encodeWithSignature("InvalidAddress()"));
        (bool ok4, ) = address(proxy).call{value: 0.1 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                2,
                block.timestamp + 3600
            )
        );
        if (!ok4) {
            revert CallFailed();
        }
    }

    ////////////////////////////////////////////////////////////////
    ///                    testAcceptBuyOffer                    ///
    ////////////////////////////////////////////////////////////////
   
    function testAcceptBuyOffer() public {
        
        /////////////BUY OFFER 0//////////////
        startHoax(bob, 1 ether);
        vm.expectEmit();
        emit NewBuyOffer(0, bob);
        (bool ok1, ) = address(proxy).call{value: 0.4 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                nft,
                1,
                block.timestamp + 3600
            )
        );
        if (!ok1) {
            revert("CallFailed");
        }
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
        assertEq(0.6 ether, bob.balance);

        /////////////BUY OFFER 1//////////////
        (bool ok2, ) = address(proxy).call{value: 0.3 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                2,
                block.timestamp + 100
            )
        );
        if (!ok2) {
            revert CallFailed();
        }
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            2,
            "No se ha creado la Offer"
        );
        
        /////////////BUY OFFER 2//////////////
        (bool ok3, ) = address(proxy).call{value: 0.2 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                3,
                block.timestamp + 3600
            )
        );
        if (!ok3) {
            revert CallFailed();
        }
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            3,
            "No se ha creado la Offer"
        );
        
        /////////////CANCEL BUY OFFER 1//////////////
        assertEq(0.1 ether, bob.balance);
        vm.warp(block.timestamp + 110);
        IMarketplaceBlockcoder(address(proxy)).cancelBuyOffer(1);
        assertEq(0.4 ether, bob.balance);
        (, , , , isEnded) = IMarketplaceBlockcoder(address(proxy)).getBuyOffer(1);
        assertEq(isEnded, true);

        /////////////ERROR BUY OFFER 0//////////////
        startHoax(alice, 1 ether);
        nft.approve(address(proxy), 1);
        vm.startPrank(carol);
        vm.expectRevert(abi.encodeWithSignature("YouAreNotOwner()"));
        IMarketplaceBlockcoder(address(proxy)).acceptBuyOffer(0);

        /////////////ERROR BUY OFFER 1/////////////
        vm.startPrank(alice);
        nft.approve(address(proxy), 2);
        vm.expectRevert(abi.encodeWithSignature("OfferNotExist()"));
        IMarketplaceBlockcoder(address(proxy)).acceptBuyOffer(1);


        /////////////ACCEPT BUY OFFER 0//////////////
        assertEq(nft.ownerOf(1), alice);
        nft.approve(address(proxy), 1);
        assertEq(address(proxy), nft.getApproved(1));
        vm.expectEmit();
        emit BuyOfferAccepted(0, alice);

        IMarketplaceBlockcoder(address(proxy)).acceptBuyOffer(0);
    
        assertEq(0.4 ether, bob.balance);
        assertEq(1.4 ether, alice.balance);
        assertEq(nft.ownerOf(1), bob);
        (, , , , isEnded) = IMarketplaceBlockcoder(address(proxy)).getBuyOffer(0);
        assertEq(isEnded, true);

        /////////////ERROR BUY OFFER 2/////////////
        nft.approve(address(proxy), 3);
        vm.warp(block.timestamp + 3700);
        vm.expectRevert(abi.encodeWithSignature("OfferHasExpired()"));
        IMarketplaceBlockcoder(address(proxy)).acceptBuyOffer(2);
    }

    ////////////////////////////////////////////////////////////////
    ///                   testCancelBuyOffer                    ///
    ////////////////////////////////////////////////////////////////

    function testCancelBuyOffer() public {
        startHoax(alice, 1 ether);
        /////////////BUY OFFER 0//////////////
        (bool ok1, ) = address(proxy).call{value: 0.3 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                1,
                block.timestamp + 3600
            )
        );
        if (!ok1) {
            revert("CallFailed");
        }
        assertEq(0.7 ether, alice.balance);
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            1,
            "No se ha creado la Offer"
        );
        /////////////BUY OFFER 1//////////////
        (bool ok2, ) = address(proxy).call{value: 0.2 ether}(
            abi.encodeWithSignature(
                "createBuyOffer(address,uint256,uint256)",
                address(nft),
                2,
                block.timestamp + 3600
            )
        );
        if (!ok2) {
            revert("CallFailed");
        }
        assertEq(0.5 ether, alice.balance);
        assertEq(
            IMarketplaceBlockcoder(address(proxy)).buyOfferIdCounter(),
            2,
            "No se ha creado la Offer"
        );

        /////////////ERROR1 BUY OFFER 0//////////////
        vm.startPrank(bob);
        vm.expectRevert(abi.encodeWithSignature("YouAreNotOwner()"));
        IMarketplaceBlockcoder(address(proxy)).cancelBuyOffer(0);

        /////////////ERROR2 BUY OFFER 0//////////////
        vm.startPrank(alice);
        vm.expectRevert(abi.encodeWithSignature("OfferNotExpired()"));
        IMarketplaceBlockcoder(address(proxy)).cancelBuyOffer(0);

        /////////////CANCEL BUY OFFER 0//////////////
        vm.warp(block.timestamp + 3610);
        assertEq(0.5 ether, alice.balance);
        vm.expectEmit();
        emit BuyOfferCancelled(0, alice);
        IMarketplaceBlockcoder(address(proxy)).cancelBuyOffer(0);
        assertEq(0.8 ether, alice.balance);
        (, , , , isEnded) = IMarketplaceBlockcoder(address(proxy)).getBuyOffer(0);
        assertEq(isEnded, true);

        /////////////ERROR3 BUY OFFER 0//////////////
        vm.expectRevert(abi.encodeWithSignature("OfferNotExist()"));
        IMarketplaceBlockcoder(address(proxy)).cancelBuyOffer(0);
    }

    }