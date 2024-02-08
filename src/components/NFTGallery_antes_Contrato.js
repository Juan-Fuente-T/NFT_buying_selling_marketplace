import { useEffect, useState, React } from 'react';
import styles from '../styles/NFTGallery.module.css';
const axios = require('axios');

const NFTGallery = ({ nfts, nftsData, onAcceptOffer }) => {
    useEffect(() => {
        console.log("Datos en Gallery. ", nftsData);
    }, [nftsData]);
    const [nftData, setNftData] = useState();
    async function getNFTMetadata(nftAddress, tokenId, networkId) {
        //const url = `https://api.chainbase.com/v1/nfts/${contractAddress}/${tokenId}`;
        const MALdata = {
            blockchain: 'ethereum',
            contract_address: '0xed5af388653567af2f388e6224dc7c4b3241c544',
            token_id: '1',
            name: 'Azuki',
            symbol: 'AZUKI',
            image_uri: 'ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png',
            mint_transaction_hash: '0xc208fdb2f133bda64522fececd6518a565aaa6e8801b0a776f2f93c922fe9420',
            rarity_score: 0.8797867,
            rarity_rank: 7397,
            owner: '0xc8967d1537f7b995607a1dea2b0c06e18a9756a2',
            erc_type: 'ERC721',
            mint_time: 1641961048000,
            token_uri: 'ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/1',
            metadata: {
                attributes: [
                    [Object], [Object],
                    [Object], [Object],
                    [Object], [Object],
                    [Object]
                ],
                image: 'ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png',
                name: 'Azuki #1'
            },
            traits: [
                { trait_type: 'Type', value: 'Human' },
                { trait_type: 'Hair', value: 'Pink Hairband' },
                { trait_type: 'Clothing', value: 'White Qipao with Fur' },
                { trait_type: 'Eyes', value: 'Daydreaming' },
                { trait_type: 'Mouth', value: 'Lipstick' },
                { trait_type: 'Offhand', value: 'Gloves' },
                { trait_type: 'Background', value: 'Off White D' }
            ]
        }

        const nft = {
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
        };
        return nft;
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

        //return data;
        /*FUNCIONA const response = {
            url: `https://api.chainbase.online/v1/nft/metadata?chain_id=${networkId}&contract_address=${nftAddress}&token_id=${tokenId}`,
            method: 'GET',
            headers: {
                'x-api-key': '2brAkOvZrcHrKNy0T3QNPlIBF0o', // Reemplaza este campo con tu clave API de Chainbase.
                'accept': 'application/json'
            }
        };
        console.log("RESPONSE:", response);
        console.log("RESPONSE.data:", response.data);
        axios(response)
            .then(response => console.log(response.data.data))
            .catch(error => console.log(error));*/
        /*try {
            //const response = await axios.get(url);
            const response = {
                url: `https://api.chainbase.online/v1/nft/metadata?chain_id=${networkId}&contract_address=${nftAddress}&token_id=${tokenId}`,
                method: 'GET',
                headers: {
                    'x-api-key': '2brAkOvZrcHrKNy0T3QNPlIBF0o', // Reemplaza este campo con tu clave API de Chainbase.
                    'accept': 'application/json'
                }
            };
            console.log("APIKEY:", process.env.CHAINBASE_API_KEY);
            console.log("METADATA:  ", response.data);

            return response.data;
        } catch (error) {
            console.error(error);
        }*/
    }
    // Uso de la función
    //const nftAddress = '0x123456789'; // Dirección del contrato del NFT
    //const tokenId = '1'; // ID del token del NFT

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
                    {nfts.map((nft) => (
                        <div className={styles.nft_details} key={nft.id}>
                            <img className={styles.nft_image} src={nft.image} alt={`NFT ${nft.id}`} />
                            <div className={styles.nft_data}>
                                <p className={styles.nft_price}>Price: {nft.price} ETH</p>
                                <p className={styles.nft_name}>Name: {nft.name}</p>
                                {nft.offerType === 'sell' && (
                                    <button className={styles.accept_button} onClick={() => onAcceptOffer(nft.id, 'sell')}>Accept Offer</button>
                                )}
                                {nft.offerType === 'buy' && (
                                    <button className={styles.accept_button} onClick={() => onAcceptOffer(nft.id, 'buy')}>Accept Offer</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NFTGallery;
<div className={styles.gallery}></div>

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