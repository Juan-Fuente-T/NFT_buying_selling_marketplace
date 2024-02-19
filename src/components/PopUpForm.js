// PopupForm.js
import React, { useContext, useState, useRef } from 'react';
import styles from '../styles/PopUpForm.module.css';
import { Contract, providers, utils, ethers } from 'ethers';
//import { NFT_CONTRACT_ADDRESS } from "../constants";
import contractABI from '../contractABI.json';
import { WalletContext } from './WalletContext';
import Web3Modal from "web3modal";
require('dotenv').config();
//const providerUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

// Acceder al array "abi" dentro del objeto
const abi = contractABI.abi;


//const web3ModalRef = useRef();
const PopupForm = ({ onClose, onSubmit }) => {

    const [sellOffersEvents, setSellOffersEvents] = useState([]);
    const [buyOffersEvents, setBuyOffersEvents] = useState([]);
    console.log("ABIPop:", abi);
    console.log("NFT_CONTRACT_ADDRESSPop:", contractAddress);

    const { signer, connectWallet } = useContext(WalletContext);

    const [loading, setLoading] = useState(false);
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [deadline, setDeadline] = useState('');
    const [offerType, setOfferType] = useState('sell');

    const abiPart = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_approved",
                    "type": "address"
                },
                {
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {/*
            const provider = await web3ModalRef.current.connect();
            const web3Provider = new providers.Web3Provider(provider);
            const signer = web3Provider.getSigner();
            setSigner(signer);*/

            if (!nftAddress || !tokenId || !price || !deadline) {
                throw new Error("Please fill in all required fields");
            }
            if (!signer) {
                throw new Error("Wallet not connected. Please connect your wallet.");
            }

            // We need a Signer here since this is a 'write' transaction.
            //const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods

            //const provider = new ethers.providers.JsonRpcProvider(providerUrl);

            const marketplaceContract = new Contract(contractAddress, abi, signer);
            const nftContract = new Contract(nftAddress, abiPart, signer);

            onSubmit({ nftAddress, tokenId, price, deadline });
            // Conviertir el precio a wei
            const priceInWei = ethers.utils.parseEther(price);

            console.log("PRICFormulario", price);
            console.log("PRICEinWEI", priceInWei);
            // Calcular el plazo final en segundos
            const deadlineInSeconds = Math.floor(Date.now() / 1000) + (parseInt(deadline) * 60 * 60 * 24);
            console.log("DEADLINE: ", deadlineInSeconds);
            const numTokenId = parseInt(tokenId);
            if (offerType == "sell") {
                //Llama a la función approve en el contrato NFT
                const approveTx = await nftContract.approve(contractAddress, tokenId);
                setLoading(true);
                //Espera a que la transacción de aprobación sea minada
                await approveTx.wait();
                console.log("NFT approved for transfer.");
                setLoading(false);
                console.log("APPROVED?");
                const tx = await marketplaceContract.createSellOffer(
                    nftAddress,
                    numTokenId,
                    priceInWei,
                    deadlineInSeconds
                );
                setLoading(true);
                setNftAddress()
                /*
                // Llama a la función createSellOffer en el contrato del marketplace
                const createSellOfferTx = await marketplaceContract.createSellOffer(
                nftAddress,
                tokenId,
                ethers.utils.parseEther(price),
                Math.floor(Date.now() /  1000) + parseInt(deadline) *  60 *  60 *  24
                );
                            // Espera a que la transacción de creación de oferta de venta sea minada
                await createSellOfferTx.wait();
                console.log("Sell offer created successfully.");
                */
                // wait for the transaction to get mined
                //await tx.wait();
                const receipt = await tx.wait();

                // Filtra los eventos relacionados con NewSellOffer
                const newSellOfferEvents = receipt.events.filter(event => event.event === 'NewSellOffer');
                setLoading(false);
                console.log("Transaction Hash:", tx.hash);
                window.alert(`Transaction Hash: ${tx.hash}`);
                window.alert("You successfully created a Sell Offer!");
                // Almacena la información relevante en tu aplicación
                newSellOfferEvents.forEach(event => {
                    const sellOfferData = {
                        nftAddress: event.args.sellOfferId ? event.args.sellOfferId.toNumber() : null,
                        offerer: event.args.offerer ? event.args.offerer : null,
                        tokenId: event.args.tokenId ? event.args.tokenId.toNumber() : null,
                        price: event.args.price ? event.args.price.toString() : null,
                        deadline: event.args.deadline ? event.args.deadline.toNumber() : null,
                    };
                    // Almacena sellOfferData 
                    sellOffersEvents.push(sellOfferData);
                    setSellOffersEvents(sellOffersEvents);
                    console.log("EVENTS: ", sellOffersEvents);
                })

            } else {
                const tx = await marketplaceContract.createBuyOffer(
                    nftAddress,
                    numTokenId,
                    deadlineInSeconds,
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                    { value: priceInWei });
                setLoading(true);
                console.log("Transaction Hash:", tx.hash);
                // wait for the transaction to get mined
                //await tx.wait();
                const receipt = await tx.wait();

                // Filtra los eventos relacionados con NewSellOffer
                const newBuyOfferEvents = receipt.events.filter(event => event.event === 'NewBuyOffer');
                setLoading(false);
                window.alert(`Transaction Hash: ${tx.hash}`)
                window.alert("You successfully created a Buy Offer!");
                newBuyOfferEvents.forEach(event => {
                    const buyOfferData = {
                        buyOfferId: event.args.buyOfferId ? event.args.sellOfferId.toNumber() : null,
                        offerer: event.args.offerer ? event.args.offerer : null,
                        tokenId: event.args.tokenId ? event.args.tokenId.toNumber() : null,
                        price: event.args.price ? event.args.price.toString() : null,
                        deadline: event.args.deadline ? event.args.deadline.toNumber() : null,
                    };
                    // Almacena sellOfferData 
                    buyOffersEvents.push(buyOfferData);
                    setBuyOffersEvents(buyOffersEvents);
                    console.log("EVENTS: ", buyOffersEvents);
                })
            }

            onClose();
        } catch (error) {
            // Manejamos cualquier error ocurrido durante el proceso
            console.error("Error:", error.message);
            window.alert(`Error: ${error.message}`);
        }
    };

    const handleOfferTypeChange = (type) => {
        setOfferType(type);
    };

    if (!signer) {
        // El monedero no está conectado, puedes mostrar un mensaje o intentar reconectar
        return (
            <div>
                <p>Wallet not connected. Please connect your wallet.</p>
                <button onClick={connectWallet}>Connect Wallet</button>
            </div>
        );
    }

    return (
        <div className={styles.popup}>
            <div>
                <h2 className={styles.title}> Create Offer</h2>
            </div>
            <div>

                <div className={styles.container_labels}>
                    <label className={styles.offer_labels}>
                        Offer Type:
                        <select className={styles.select_offer_label} value={offerType} onChange={(e) => handleOfferTypeChange(e.target.value)}>
                            <option value="sell">SellOffer</option>
                            <option value="buy">BuyOffer</option>
                        </select>
                    </label>
                </div>

                <div className={styles.popup_content}>
                    <span className={styles.close} onClick={onClose}>&times;</span>

                    <form onSubmit={handleSubmit}>
                        {/* Campos del formulario */}
                        <div>
                            <label>
                                NFT Address:
                                <input className={styles.input_address} type="text" value={nftAddress} onChange={(e) => setNftAddress(e.target.value)} />
                            </label>
                        </div>
                        <div>
                            <label>
                                NFT ID:
                                <input className={styles.input} type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                            </label>
                            <label>
                                Price:
                                <input className={styles.input} type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </label>
                            <label>
                                Deadline in days:
                                <input className={styles.input} type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                            </label>
                        </div>
                        <button className={styles.submit_button} type="submit">Enviar</button>
                    </form>
                    {loading && (
                        <div className={styles.loadingPopup}>
                            <p className={styles.loading}>Loading...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupForm;
