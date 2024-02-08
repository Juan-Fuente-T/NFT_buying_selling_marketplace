// PopupForm.js
import React, { useContext, useState } from 'react';
import styles from '../styles/PopUpForm.module.css';
import { Contract, utils } from 'ethers';
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { WalletContext } from './WalletContext';

const PopupForm = ({ onClose, onSubmit }) => {
    const { signer, connectWallet } = useContext(WalletContext);
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [deadline, setDeadline] = useState('');
    const [offerType, setOfferType] = useState('sell');

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit({ nftAddress, tokenId, price, deadline });

        console.log("Sell Offer");
        // We need a Signer here since this is a 'write' transaction.
        //const signer = await getProviderOrSigner(true);
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

        try {
            if (offerType == "sell") {
                const tx = await nftContract.createSellOffer({
                    nftAddress, tokenId, price, deadline
                });
                setLoading(true);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully created a Sell Offer!");
            } else {
                const tx = await nftContract.createBuyOffer({
                    nftAddress, tokenId, deadline
                    // value signifies the cost of one Planet NFT which is "0.01" eth.
                    // We are parsing price string to ether using the utils library from ethers.js
                }, { value: utils.parseEther(price) });
                setLoading(true);
                // wait for the transaction to get mined
                await tx.wait();
                setLoading(false);
                window.alert("You successfully created a Sell Offer!");
            }
        } catch (err) {
            console.error(err);
        };
        onClose();
    };

    const handleOfferTypeChange = (type) => {
        setOfferType(type);
    };

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
                        {/* Otros campos... */}
                        <button className={styles.submit_button} type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupForm;
