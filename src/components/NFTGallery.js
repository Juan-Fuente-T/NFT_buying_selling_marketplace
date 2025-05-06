import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles/NFTGallery.module.css';
const axios = require('axios');
import { Contract, providers, utils, ethers, Signer } from 'ethers';
import contractABI from '../contractABI.json';
import abiPartERC721 from '../abiPartERC721.json';
import { WalletContext } from './WalletContext';
import { parseBytes32String } from 'ethers/lib/utils';
require('dotenv').config();

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
// Acceder al array "abi" dentro del objeto
const abi = contractABI.abi;

// Llama a la función de actualización
/*const transaction = marketplaceContract.upgradeToAndCall('0x3b0C463bAB78509386C4A171f7CF8e5885Bba76A', "");
const transaction = (bool success, ) = address(proxy1967_UUPS).call(
    abi.encodeWithSignature(
        "upgradeToAndCall(address,bytes)",
        address(implementationV2),
        ""
    )
);*/

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
    const [formattedDeadlines, setFormattedDeadlines] = useState([]);
    const [sellOffers, setSellOffers] = useState([]);
    const [buyOffers, setBuyOffers] = useState([]);
    const { signer, connectWallet } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    console.log("SignerANtes:", signer);
    // Verificar si la billetera está conectada
    const isWalletConnected = signer !== null;

    // Si la billetera no está conectada, instanciar un signer local
    //const _signer = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);

    // Usar el signer local si la billetera no está conectada
    //const currentSigner = isWalletConnected ? signer : _signer;
    //console.log("SignerDespues:", currentSigner);


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

    //console.log("DATAfromINDEX", nftsData.tokenId);



    // Estado para almacenar los metadatos de los NFTs
    const [nftMetadatas, setNftMetadatas] = useState([]);

    //const marketplaceContract = new Contract(contractAddress, abi, currentSigner);
    const marketplaceContract = new Contract(contractAddress, abi, signer);
    //const nftContract = new Contract(sellOffers.nftAddress, abiPartERC721.json, currentSigner);
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);
    console.log("Provider:", provider);
    // Instancia del contrato sin signer (para obtener información)
    const marketplaceContractInfo = new Contract(contractAddress, abi, provider);





    console.log("Datos_en_Gallery: ", nftsData?.nftAddress, nftsData?.tokenId, nftsData?.price);
    //console.log("YYYYYYYYYYY", ethers.utils.parseEther(nftsData.price));

    const fetchOffers = async () => {
        try {


            /*try {
                // Llama a la función de actualización
                const transaction = await marketplaceContract.upgradeToAndCall(
                    '0x3b0C463bAB78509386C4A171f7CF8e5885Bba76A',
                    ""
                );

                // Espera a que la transacción se mine
                await transaction.wait();

                // Puedes imprimir un mensaje indicando que la actualización se ha realizado correctamente
                console.log("pppppppppppppppppppppppppppppppppKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
                console.log('Contrato actualizado con éxito:', transaction.hash);
            } catch (error) {
                // Maneja cualquier error que pueda ocurrir durante la ejecución
                console.error('Error al actualizar el contrato:', error);
            }*/


            // Estado para almacenar los metadatos de los NFTs
            //const [nftMetadatas, setNftMetadatas] = useState([]);
            // Obtén el número total de sell offers desde el contrato
            const _totalSellOffers = await marketplaceContractInfo.sellOfferIdCounter(); // NFTs are at index n + 1 in the sellOfferIdCounter variable



            //setTotalSellOffers(total.sub(1)); // Subtract  1 because the counter starts at  1
            const totalSellOffers = _totalSellOffers.toNumber();
            console.log("TOTALSELLOFFER", totalSellOffers);
            const _offer = await marketplaceContractInfo.getSellOffer(0);
            console.log("OFFERsinFiltro", _offer);
            const sellOffersArray = [];
            if (totalSellOffers !== 0) {
                for (let i = 0; i < totalSellOffers; i++) {
                    const offer = await marketplaceContractInfo.getSellOffer(i);

                    // Filtra las ofertas que no han sido terminadas
                    if (!offer[5]) { // If isEnded is false
                        console.log("IsEnded:", offer[5]);
                        console.log("Deadline:", offer[4]);
                        console.log("Price:", offer[3]);
                        console.log("TokenId:", offer[2]);
                        const sellOfferId = i;
                        const nftDataArray = await getNFTMetadata(offer[0], offer[2], 11155111); // Obtiene la URI del token
                        //const metadataResponse = await fetch(tokenURI); // Fetch the metadata from the URI
                        const nftData = nftDataArray[0]; // Parse the JSON response
                        //LLAMAR A FUNCION CON API
                        //const metadata = await nftData.json(); // Parse the JSON response

                        const newSellOffer = {
                            nftAddress: offer[0], // offer[0] is the NFT address
                            offerer: offer[1], //  offer[1] is the offerer's address
                            tokenId: offer[2], // offer[2] is the token ID
                            price: offer[3], // offer[3] is the price
                            deadline: offer[4], // offer[4] is the is the deadline
                            isEnded: offer[5], // offer[5] is the isEnded flag
                            image_url: nftData.image_url,
                            name: nftData.name,
                            offerId: sellOfferId
                        };
                        console.log("Image_url", newSellOffer.image_url);
                        sellOffersArray.push(newSellOffer);
                        console.log("OFFER0: ", sellOffersArray[0])
                        console.log("OFFER__0?: ", sellOffers[0])

                    } else {
                        console.log("NO HAY SELL");
                    }
                }
            }
            setSellOffers(sellOffersArray);

            const _totalBuyOffers = await marketplaceContractInfo.buyOfferIdCounter(); // NFTs are at index n + 1 in the sellOfferIdCounter variable
            const totalBuyOffers = _totalBuyOffers.toNumber();
            console.log("NFTs_en_BUYGallery: ", _totalBuyOffers, totalBuyOffers);
            const buyOffer = await marketplaceContractInfo.getBuyOffer(0).deadline;
            console.log("BUYOffer_sin_filtro: ", buyOffer);
            console.log("TOTALBUYOFFER", totalBuyOffers);
            const buyOffersArray = [];
            if (totalBuyOffers !== 0) {
                for (let i = 0; i < totalBuyOffers; i++) {
                    const offer = await marketplaceContractInfo.getBuyOffer(i);
                    // Filtra las ofertas que no han sido terminadas
                    if (!offer[5]) { // If isEnded is false
                        const buyOfferId = i;
                        const nftDataArray = await getNFTMetadata(offer[0], offer[2], 11155111); // Obtiene la URI del token

                        const nftData = nftDataArray[0];
                        const newBuyOffer = {
                            nftAddress: offer[0], // offer[0] is the NFT address
                            offerer: offer[1], // offer[1] is the offerer's address
                            tokenId: offer[2], // offer[2] is the token ID
                            price: offer[3], // offer[3] is the price
                            deadline: offer[4], // offer[4] is the is the deadline
                            isEnded: offer[5], // offer[5] is the isEnded flag
                            image_url: nftData.image_url,
                            name: nftData.name,
                            offerId: buyOfferId
                        };
                        buyOffersArray.push(newBuyOffer);
                    }
                    console.log("PRICE_BUCLE: ", offer[3]);
                }
            } else {
                console.log("NO HAY BUY");
            }
            setBuyOffers(buyOffersArray);

            //bueno https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png
            console.log("SellOffersArray: ", sellOffers);
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    };
    /*useEffect(() => {
        console.log("SellOffersPRICEXX: ", sellOffers.tokenId);
    }, [sellOffers]);*/

    // Llamada a la función que obtiene las sell offers cuando el componente se monta
    useEffect(() => {
        fetchOffers();
        //}, [currentSigner]); // Dependencia en signer para volver a ejecutar la función cuando se conecta la billetera
    }, [signer]); // Dependencia en signer para volver a ejecutar la función cuando se conecta la billetera


    useEffect(() => {
        // Solo busca los metadatos si hay ofertas de venta disponibles
        if ((sellOffers.length > 0 || buyOffers.length > 0) && !loading) {
            fetchNFTMetadatas();
        }
    }, [sellOffers, buyOffers, loading]);// Dependencia en sellOffers para volver a ejecutar la función cuando cambian las ofertas
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
    //const networkId = '80001'; //Id de la net, en este caso mumbai

    /*useEffect(() => {
        const formatDeadlines = async () => {
            try {
                const formattedDates = await Promise.all(
                    sellOffers.map(async (individualOffer) => {
                        const fecha = new Date(individualOffer.deadline * 1000);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const anio = fecha.getFullYear().toString().slice(-2);
                        const formattedDate = `${dia}/${mes}/${anio}`;
                        console.log('FormattedXXXDate:', individualOffer.deadline);
                        console.log('Formatted Date:', formattedDate);
                        console.log('Merdaseca:', sellOffers);
                        return formattedDate;
                    })
                );
                setFormattedDeadlines(formattedDates);
            } catch (error) {
                console.error('Error formatting deadlines:', error);
            }
        };

        formatDeadlines();
    }, [sellOffers]);*/

    const handleOfferAction = async (offerId, actionType, nftAddress, tokenId, price) => {
        try {
            /*console.log("XXXXXXX3", price);
            //console.log("DATOSXXX: ", sellOffers.nftAddress, abiPartERC721.json, currentSigner);
    
            console.log("OfferId: ", offerId);
            console.log("PARAMETROS", offerId, actionType, nftAddress, tokenId, price);*/


            //const numOfferId = parseInt(offerId);
            console.log("PRICEXXXXXXX", price);


            if (actionType === 'acceptSellOffer') {
                //console.log("DATOSXXXBOTON: ", nftAddress, abiPartERC721, currentSigner);
                console.log("DATOSXXXBOTON: ", nftAddress, abiPartERC721, signer);

                console.log("PARAMETROS BOTON: ", offerId, actionType, nftAddress, tokenId, price);
                console.log("PRICE: ", price);

                // Primero, construye la transacción
                /*const transactionParameters = {
                    from: signer.g,
                    to: sellOffers.offerer,
                    value: price, // Aquí especificas el valor en ether que deseas enviar
                    gas:30000, // Puedes ajustar el límite de gas según tus necesidades
                  };
                  
                  // Luego, llama a la función del contrato
                  contractInstance.methods.acceptSellOffer(1).send(transactionParameters)
                  .on('transactionHash', function(hash){
                    // Maneja el hash de la transacción si es necesario
                  })
                  .on('receipt', function(receipt){
                    // Maneja el recibo de la transacción si es necesario
                  })
                  .on('confirmation', function(confirmationNumber, receipt){
                    // Maneja la confirmación de la transacción si es necesario
                  })
                  .on('error', console.error); // Maneja cualquier error que pueda ocurrir durante el envío de la transacción*/
                console.log("Value: ", price);
                //const priceInWei = ethers.utils.parseEther(price);
                const estimatedGasLimit = await marketplaceContract.estimateGas.acceptSellOffer(
                    offerId,
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                    { value: parsedPrice });
                console.log("GasLimit: ", estimatedGasLimit);
                const _gasLimit = ethers.utils.hexlify(estimatedGasLimit);
                const tx = await marketplaceContract.acceptSellOffer(
                    offerId,
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                    // { value: parsedPrice, gasLimit: ethers.constants.MaxUint256 });
                    { value: parsedPrice, gasLimit: estimatedGasLimit });
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully accepted a Sell Offer! You receive the NFT");


            } else if (actionType === 'cancelSellOffer') {
                console.log("SellOfferID: ", offerId);
                const estimatedGasLimit = await marketplaceContract.estimateGas.cancelSellOffer(
                    offerId);
                console.log("GasLimitCANCEL: ", estimatedGasLimit);
                const gasLimit = ethers.utils.hexlify(estimatedGasLimit);
                const tx = await marketplaceContract.cancelSellOffer(offerId, { gasLimit: gasLimit });
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully cancelled a Sell Offer!");

            } else if (actionType === 'acceptBuyOffer') {
                //const nftContract = new Contract(nftAddress, abiPartERC721.json, currentSigner);
                const nftContract = new Contract(nftAddress, abiPartERC721.json, signer);
                const approveTx = await nftContract.approve(contractAddress, tokenId);
                setLoading(true);
                // wait for the transaction to get mined
                await approveTx.wait();
                const tx = await marketplaceContract.acceptBuyOffer(offerId);
                console.log("Transaction Hash:", tx.hash);
                setLoading(false);
                window.alert("You successfully accepted a Buy Offer! You selled the NFT and receive the Ether");
            } else if (actionType === 'cancelBuyOffer') {
                const tx = await marketplaceContract.cancelBuyOffer(offerId);
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
    /*
        if (loading) {
            return (
                <div>
                    <p className={styles.loading}>Loading...</p>
                </div>);
        }*/
    {
        loading && (
            <div className={styles.loadingPopup}>
                <p className={styles.loading}>Loading...</p>
            </div>
        )
    }

    return (
        <div className={styles.container_gallery}>
            <h2 className={styles.offers_title}>OFERTAS DE VENTA</h2>
            <div className={styles.gallery}>
                <div className={styles.nft_card}>
                    {Array.isArray(sellOffers) && sellOffers.length > 0 ? (
                        // Renderizar ofertas si hay alguna
                        sellOffers.map((individualOffer, index) => (
                            <div className={styles.nft_details} key={index}>
                                <img className={styles.nft_image} src={individualOffer.image_url} alt={`NFT ${individualOffer.tokenId}`} />
                                <div className={styles.nft_data}>
                                    <p className={styles.nft_price}>Precio: {ethers.utils.formatEther(individualOffer.price)} ETH</p>
                                    <p className={styles.nft_name}>Nombre: {individualOffer.name}</p>
                                    <p className={styles.nft_deadline}>Finaliza: {new Date(individualOffer.deadline * 1000).toLocaleDateString()}</p>


                                    <button className={styles.accept_button} onClick={() => handleOfferAction(parseInt(individualOffer.offerId), 'acceptSellOffer', individualOffer.nftAddress, parseInt(individualOffer.tokenId), individualOffer.price)}>Aceptar oferta</button>
                                    <button className={styles.accept_button} onClick={() => handleOfferAction(parseInt(individualOffer.offerId), 'cancelSellOffer', individualOffer.nftAddress, parseInt(individualOffer.tokenId), individualOffer.price)}>Cancelar oferta</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Mostrar mensaje si no hay ofertas
                        <p>No hay ofertas disponibles.</p>
                    )}
                </div>
            </div>
            <h2 className={styles.offers_title}>OFERTAS DE COMPRA</h2>
            <div className={styles.gallery}>
                <div className={styles.nft_card}>
                    {Array.isArray(buyOffers) && buyOffers.length > 0 ? (
                        // Renderizar ofertas si hay alguna
                        buyOffers.map((individualOffer, index) => (

                            <div className={styles.nft_details} key={index}>
                                <img className={styles.nft_image} src={individualOffer.image_url} alt={`NFT ${individualOffer.tokenId}`} />
                                <div className={styles.nft_data}>
                                    <p className={styles.nft_price}>Price: {ethers.utils.formatEther(individualOffer.price)} ETH</p>
                                    <p className={styles.nft_name}>Name: {individualOffer.name}</p>
                                    <p>Finaliza: {new Date(individualOffer.deadline * 1000).toLocaleDateString()}</p>

                                    <button className={styles.accept_button} onClick={() => handleOfferAction(parseInt(individualOffer.offerId), 'acceptBuyOffer', individualOffer.nftAddress, parseInt(individualOffer.tokenId), individualOffer.price)}>Accept Offer</button>
                                    <button className={styles.accept_button} onClick={() => handleOfferAction(parseInt(individualOffer.offerId), 'cancelBuyOffer', individualOffer.nftAddress, parseInt(individualOffer.tokenId), individualOffer.price)}>Cancel Offer</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Mostrar mensaje si no hay ofertas
                        <p>No hay ofertas disponibles.</p>
                    )}
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

/*
import Web3 from 'web3';

// Conectar a la red Ethereum (aquí usamos la red local de desarrollo)
const web3 = new Web3(window.ethereum || 'http://localhost:8545');

// Dirección del contrato
const contractAddress = '0xYourContractAddress';

// ABI del contrato (necesitas proporcionar la ABI completa)
const contractAbi = [
  // ... (coloca aquí la ABI de tu contrato)
];

// Crear una instancia del contrato
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Función para crear una oferta de compra
async function createBuyOffer(nftAddress, tokenId, deadline) {
  try {
    // Dirección del usuario actual
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Montante de Ether a enviar (en Wei)
    const ethAmount = web3.utils.toWei('0.1', 'ether'); // Ejemplo:  0.1 ETH

    // Llamar a la función createBuyOffer del contrato
    const receipt = await contract.methods.createBuyOffer(nftAddress, tokenId, deadline)
      .send({ from: userAddress, value: ethAmount });

    console.log('Oferta de compra creada exitosamente:', receipt);
  } catch (error) {
    console.error('Error al crear la oferta de compra:', error);
  }
}

// Ejemplo de uso de la función
createBuyOffer('0xNftContractAddress', '1', Math.floor(Date.now() /  1000) +  60 *  60 *  24); // Oferta válida por  24 hor
*/
