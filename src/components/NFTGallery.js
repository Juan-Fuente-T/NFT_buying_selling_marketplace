import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles/NFTGallery.module.css';
const axios = require('axios');
import { Contract, providers, utils, ethers } from 'ethers';
import contractABI from '../contractABI.json';
import abiPartERC721 from '../abiPartERC721.json';
import { WalletContext } from './WalletContext';
require('dotenv').config();

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
// Acceder al array "abi" dentro del objeto
const abi = contractABI.abi;



async function getNFTMetadata(nftAddress, tokenId, networkId) {


    const nft = [{
        animation_url: null,
        collection: "azukiteamsepolia",
        contract: "0x98b2c7c22e1fbf77ee66d92d4d75515b52aebfe8",
        creator: "0x8e1f1868458900e0f712fe4d2f151a74eb21f1f5",
        description: null,
        identifier: "1",
        image_url: "https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png",
        is_disabled: false,
        is_nsfw: false,
        is_suspicious: false,
        metadata_url: "https://ipfs.io/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/1",
        name: "Azuki #1",
        opensea_url: "https://testnets.opensea.io/assets/sepolia/0x98b2c7c22e1fbf77ee66d92d4d75515b52aebfe8/1",
        owners: [{
            address: "0x9eb665d4373b07e4c913c21f7f4680927684d02a",
            quantity: 1
        }],
        rarity: null,
        token_standard: "erc721",
        traits: [
            { trait_type: 'Type', display_type: null, max_value: null, value: 'Human' },
            { trait_type: 'Hair', display_type: null, max_value: null, value: 'Pink Hairband' },
            { trait_type: 'Clothing', display_type: null, max_value: null, value: 'White Qipao with Fur' },
            { trait_type: 'Eyes', display_type: null, max_value: null, value: 'Daydreaming' },
            { trait_type: 'Mouth', display_type: null, max_value: null, value: 'Lipstick' },
            { trait_type: 'Offhand', display_type: null, max_value: null, value: 'Gloves' },
            { trait_type: 'Background', display_type: null, max_value: null, value: 'Off White D' }
        ],
        updated_at: "2024-01-26T07:13:54.087430"
    }];
    //return Promise.resolve(nft);
    return nft;
}
/*const options = {
    method: 'GET',
    //headers: { accept: 'application/json', 'x-api-key': '9631f0d95dfa4c829c3fc6d3ee3490d5' }
    headers: { accept: 'application/json' }
};
try {
    const response = await fetch('https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/0x98b2c7c22e1fbf77ee66d92d4d75515b52aebfe8/nfts/1', options)
    const data = await response.json();
    //setNftData(data);
    console.log("REPONSEOpensesea", data);
    console.log("REPONSEOpensesea", data.nft.name);
    console.log("REPONSEOpensesea", data.nft.image_url);
    return data;
} catch (error) {
    console.error(error);
}*/

//0xef7CdD4bA1186be2A7c3f283DcBEa0Ba7a6B4e2f

const NFTGallery = ({ nftsData, onAcceptOffer }) => {
    const [sellOffers, setSellOffers] = useState([]);
    const [buyOffers, setBuyOffers] = useState([]);
    const { signer, connectWallet } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    /*// walletConnected keep track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    // loading is set to true when we are waiting for a transaction to get mined
    const [loading, setLoading] = useState(false);
    // tokenIdsMinted keeps track of the number of tokenIds that have been minted
    const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
    // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
    const web3ModalRef = useRef();
    // Define a new state to hold the metadata of the tokens
    const [tokenMetadatas, setTokenMetadatas] = useState({});*/
    // Estado para almacenar los metadatos de los NFTs
    const [nftMetadatas, setNftMetadatas] = useState([]);

    const marketplaceContract = new Contract(contractAddress, abi, signer);
    //const nftContract = new Contract(sellOffers.nftAddress, abiPartERC721.json, signer);
    console.log("DATOSXXX: ", sellOffers.nftAddress, abiPartERC721.json, signer);

    console.log("Datos_en_Gallery: ", nftsData.nftAddress, nftsData.tokenId);
    const fetchOffers = async () => {
        try {
            // Estado para almacenar los metadatos de los NFTs
            //const [nftMetadatas, setNftMetadatas] = useState([]);
            // Obtén el número total de sell offers desde el contrato
            const totalSellOffers = await marketplaceContract.sellOfferIdCounter(); // NFTs are at index n + 1 in the sellOfferIdCounter variable
            //setTotalSellOffers(total.sub(1)); // Subtract  1 because the counter starts at  1
            console.log("NFTs_en_Gallery: ", totalSellOffers.toNumber());

            const sellOffersArray = [];
            for (let i = 0; i < totalSellOffers; i++) {
                const offer = await marketplaceContract.getSellOffer(i);
                // Filtra las ofertas que no han sido terminadas
                if (!offer[4]) { // If isEnded is false
                    const nftDataArray = await getNFTMetadata(offer[0], offer[2], 11155111); // Obtiene la URI del token
                    //const metadataResponse = await fetch(tokenURI); // Fetch the metadata from the URI
                    const nftData = nftDataArray[0]; // Parse the JSON response
                    //const metadata = await nftData.json(); // Parse the JSON response

                    const newSellOffer = {
                        nftAddress: offer[0], // offer[0] is the NFT address
                        offerer: offer[1], //  offer[1] is the offerer's address
                        tokenId: offer[2], // offer[2] is the token ID
                        price: offer[3], // offer[3] is the price
                        isEnded: offer[4], // offer[4] is the isEnded flag
                        image_url: nftData.image_url,
                        name: nftData.name,
                        offerId: i
                    };
                    console.log("Image_url", newSellOffer.image_url);
                    sellOffersArray.push(newSellOffer);
                }
            }
            setSellOffers(sellOffersArray);

            const totalBuyOffers = await marketplaceContract.buyOfferIdCounter(); // NFTs are at index n + 1 in the sellOfferIdCounter variable
            console.log("NFTs_en_BUYGallery: ", totalBuyOffers.toNumber());
            const buyOffersArray = [];
            for (let i = 0; i < totalBuyOffers; i++) {
                const offer = await marketplaceContract.getBuyOffer(i);
                // Filtra las ofertas que no han sido terminadas
                if (!offer[4]) { // If isEnded is false
                    const newBuyOffer = {
                        nftAddress: offer[0], // offer[0] is the NFT address
                        offerer: offer[1], // offer[1] is the offerer's address
                        tokenId: offer[2], // offer[2] is the token ID
                        price: offer[3], // offer[3] is the price
                        isEnded: offer[4] // offer[4] is the isEnded flag
                    };
                    buyOffersArray.push(newBuyOffer);
                }
            }
            console.log("OfferID", offerId);
            setSellOffers(sellOffersArray);
            //bueno https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png
            console.log("SellOffersArray: ", sellOffers);
        } catch (error) {
            console.error("Error fetching sell offers:", error);
        }
    };

    // Llamada a la función que obtiene las sell offers cuando el componente se monta
    useEffect(() => {
        fetchOffers();
    }, [signer]); // Dependencia en signer para volver a ejecutar la función cuando se conecta la billetera


    useEffect(() => {
        // Solo busca los metadatos si hay ofertas de venta disponibles
        if (sellOffers.length > 0) {
            fetchNFTMetadatas();
        }
    }, [sellOffers]); // Dependencia en sellOffers para volver a ejecutar la función cuando cambian las ofertas
    console.log("BuyOffersArray: ", buyOffers);
    // Función para obtener los metadatos de los NFTs
    const fetchNFTMetadatas = async () => {
        const metadatasPromises = sellOffers.map((offer) => getNFTMetadata(offer.nftAddress, offer.tokenId, '11155111'));
        const metadatas = await Promise.all(metadatasPromises);
        setNftMetadatas(metadatas);
    };


    /*// Itera sobre todas las sell offers y obtén la información de cada una
    for (let offerId = 0; offerId < totalSellOffers - 1; offerId++) {
        const sellOffer = await nftContract.getSellOffer(offerId);
        // Obtenemos la información relevante y la agregamos al array de sellOffers
        const nftInfo = await getNFTMetadata(
            sellOffer[0], // nftAddress
            sellOffer[2], // tokenId
            '11155111'    // networkId (asumí que siempre es '11155111')
        );

        // Verificamos las condiciones para mostrar la sell offer en la galería
        const isValidSellOffer = (
            !sellOffer[4] && // No está marcada como isEnded
            sellOffer[3] > 0 && // El precio es mayor a cero (ajustar según tus necesidades)
            sellOffer[5] > Date.now() / 1000 // La fecha límite no ha expirado
        );

        if (isValidSellOffer) {
            sellOffers.push({
                nftAddress: sellOffer[0],
                offerer: sellOffer[1],
                tokenId: sellOffer[2],
                price: sellOffer[3],
                isEnded: sellOffer[4],
                nftInfo: nftInfo, // Información adicional del NFT
            });
        }
    }*/


    //MIO//const nftAddress = '0xef7CdD4bA1186be2A7c3f283DcBEa0Ba7a6B4e2f'; // Dirección del contrato del NFT
    //MIO//const tokenId = '5'; // ID del token del NFT
    const nftAddress = '0x98b2c7c22e1fbf77ee66d92d4d75515b52aebfe8'; // Dirección del contrato del NFT
    //const nftAddress = '0xed5af388653567af2f388e6224dc7c4b3241c544'; // Dirección del contrato del NFT
    const tokenId = '1'; // ID del token del NFT
    //const networkId = '80001'; //Id de la net, en este caso mumbai

    //const nftAddress = nftsData.nftAddress; // Dirección del contrato del NFT
    //const tokenId = nftsData.tokenId; // ID del token del NFT
    const networkId = '11155111'; //Id de la net, en este caso sepolia
    const _nft = getNFTMetadata(nftAddress, tokenId, networkId)
    //.then(metadata => console.log(metadata))
    //.catch(console.error);
    //setNftData(data);
    //const [nfts, setNFTs] = useState([]);
    console.log("NOMBRE:", _nft.name);
    console.log("ID:", _nft.identifier);
    //console.log("IMAGEN:", nftData.image);

    //console.log("id: ", nftsData.tokenId);



    const handleOfferAction = async (offerId, actionType, nftAddress) => {
        try {
            //console.log("DATOSXXX: ", sellOffers.nftAddress, abiPartERC721.json, signer);

            if (actionType === 'acceptSellOffer') {
                const tx = await marketplaceContract.acceptSellOffer(
                    sellOffers.offerId,
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                    { value: utils.parseEther(sellOffers.price) });
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully accepted a Sell Offer! You receive the NFT");


            } else if (actionType === 'cancelSellOffer') {
                console.log("SellOfferID: ", sellOffers.offerId);
                const tx = await marketplaceContract.cancelSellOffer(offerId);
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully cancelled a Sell Offer!");

            } else if (actionType === 'acceptBuyOffer') {
                const nftContract = new Contract(nftAddress, abiPartERC721.json, signer);
                const approveTx = await nftContract.approve(contractAddress, buyOffers.tokenId);
                setLoading(true);
                // wait for the transaction to get mined
                await approveTx.wait();
                const tx = await marketplaceContract.acceptSellOffer(
                    buyOffers.offerId,
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                    { value: utils.parseEther(buyOffers.price) });
                console.log("Transaction Hash:", tx.hash);
                setLoading(false);
                window.alert("You successfully accepted a Buy Offer! You selled the NFT and receive the Ether");
            } else if (actionType === 'cancelBuyOffer') {
                const tx = await marketplaceContract.cancelBuyOffer(buyOffers.offerId);
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully cancelled a Buy Offer!");
            }

            // Después de realizar la acción, puedes realizar otras acciones necesarias
            // Aquí puedes llamar a funciones adicionales o manejar el estado de tu aplicación
        } catch (error) {
            console.error(error);
            // Manejar errores, mostrar mensajes de error, etc.
        }
    };

    /*
                        {Array.isArray(sellOffers) && sellOffers.map(async (sellOffer) => {
                            // Obtener información adicional del NFT llamando a getNFTData
                            const nftData = await getNFTMetadata(sellOffer.nftAddress, sellOffer.tokenId, '11155111');
    
                            // Renderizar la ficha de la Sell Offer con la información obtenida
                            return (
    
    */

    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }


    return (
        <div className={styles.container_gallery}>
            <div className={styles.intro_gallery}>
                <div className={styles.container_title}>
                    <h2 className={styles.nft_title}>NFTs for Sale </h2>
                    <h2 className={styles.nft_title}>BLA BLA BLA lo que sea </h2>
                </div>
                <img className={styles.container_image} src='/pop.png' />
            </div>

            <div className={styles.gallery}>
                <div className={styles.nft_card}>
                    {Array.isArray(sellOffers) && sellOffers.map((sellOffers, index) => (

                        <div className={styles.nft_details} key={index}>
                            <img className={styles.nft_image} src={sellOffers.image_url} alt={`NFT ${sellOffers.tokenId}`} />
                            <div className={styles.nft_data}>
                                <p className={styles.nft_price}>Price: {ethers.utils.formatEther(sellOffers.price)} ETH</p>
                                <p className={styles.nft_name}>Name: {sellOffers.name}</p>

                                <button className={styles.accept_button} onClick={() => handleOfferAction(sellOffers.tokenId, 'acceptSellOffer', sellOffers.nftAddress)}>Accept Offer</button>
                                <button className={styles.accept_button} onClick={() => handleOfferAction(sellOffers.tokenId, 'cancelSellOffer', sellOffers.nftAddress)}>Cancel Offer</button>
                            </div>
                        </div>


                    ))}
                </div>
            </div>
        </div>
    );
};

export default NFTGallery;
//<div className={styles.gallery}></div>

/*
network_id = '1'; // Ver <https://docs.chainbase.com/reference/supported-chains> para obtener el ID de diferentes cadenas.
contract_addr = '0xed5af388653567af2f388e6224dc7c4b3241c544'; // Tomaremos la dirección del contrato de Azuki como ejemplo.
token_id = '1'; // El ID del token debe ser en formato hexadecimal o cadena numérica. Aquí tomamos 1 como ejemplo.
fetch(`https://api.chainbase.online/v1/nft/metadata?chain_id=${network_id}&contract_address=${contract_addr}&token_id=${token_id}`, {
    method: 'GET',
    headers: {
        'x-api-key': CHAINBASE_API_KEY, // Reemplaza este campo con tu clave API de Chainbase.
        'accept': 'application/json'
    }
}).then(response => response.json())
    .then(data => console.log(data.data))
    .catch(error => console.error(error));
Usando axios en JavaScript, primero debes instalar axios usando npm install axios --save en la terminal.

network_id = '1'; // Ver <https://docs.chainbase.com/reference/supported-chains> para obtener el ID de diferentes cadenas.
contract_addr = '0xed5af388653567af2f388e6224dc7c4b3241c544'; // Tomaremos la dirección del contrato de Azuki como ejemplo.
token_id = '1'; // El ID del token debe ser en formato hexadecimal o cadena numérica. Aquí tomamos 1 como ejemplo.
const axios = require('axios');
const options = {
    url: `https://api.chainbase.online/v1/nft/metadata?chain_id=${network_id}&contract_address=${contract_addr}&token_id=${token_id}`,
    method: 'GET',
    headers: {
        'x-api-key': CHAINBASE_API_KEY, // Reemplaza este campo con tu clave API de Chainbase.
        'accept': 'application/json'
    }
};
axios(options)
    .then(response => console.log(response.data.data))
    .catch(error => console.log(error));
Asegúrate de reemplazar CHAINBASE_API_KEY con tu clave API de Chainbase real, obtenida de tu cuenta.

5. Imprimir metadatos de NFT
En este paso, recuperaremos e imprimiremos los metadatos de NFT utilizando la API de Chainbase. Sigue estas instrucciones:

Guarda el script que escribiste en el Paso 2 en un archivo (por ejemplo, getNFTMetadata.js).
Abre la terminal y navega hasta el directorio donde guardaste el script.
Ejecuta el comando node <filename>.js para ejecutar el script y obtener los metadatos de NFT:
*/
/*
OPCION SWR
SWR es  una biblioteca de ReactJS que permite a los desarrolladores cargar datos asincr
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

const NFTList = () => {
  const { data: nfts, error } = useSWR('/api/nfts', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!nfts) return <div>Loading...</div>;

  return (
    <div>
      {nfts.map((nft, index) => (
        <div key={index}>
          <h2>{nft.name}</h2>
          <img src={nft.image} alt={nft.name} />
          <p>{nft.description}</p>
          </div>
          ))}
        </div>
      );
    };
    
    export default NFTList;

*/


