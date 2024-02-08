// PopupForm.js
import React, { useState } from 'react';
import styles from '../styles/PopUpForm.module.css';

const PopupForm = ({ onClose, onSubmit }) => {
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [deadline, setDeadline] = useState('');
    const [offerType, setOfferType] = useState('sell');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nftAddress, tokenId, price, deadline });
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
