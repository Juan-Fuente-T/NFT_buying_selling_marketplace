import React, { createContext, useState, useRef, useEffect } from 'react';
import { ethers, providers } from 'ethers';
import Web3Modal from 'web3modal';



export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    // walletConnected keep track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    const [signer, setSigner] = useState(null);
    const [address, setAddress] = useState("");
    // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
    const web3ModalRef = useRef();


    /**
     * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
     *
     * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
     * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
     * request signatures from the user using Signer functions.
     */
    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        console.log("Web3 Provider Context:", web3Provider);
        // If user is not connected to the Sepolia network, let them know and throw an error
        const network = await web3Provider.getNetwork();
        if (network.chainId !== 11155111) {
            window.alert("Change the network to Sepolia");
            throw new Error("Change network to Sepolia");
        }
        const signer = web3Provider.getSigner();

        return signer;
    };

    /*
      connectWallet: Connects the MetaMask wallet
    */
    const connectWallet = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // When used for the first time, it prompts the user to connect their wallet
            const signer = await getProviderOrSigner(true);

            // Log the provider to see if it's ready
            console.log("ProviderContext:", signer.provider);

            // Obtain the address separately and set it
            const address = await signer.getAddress();
            console.log("SignerContext:", signer);
            console.log("AddressContext:", address);

            setSigner(signer);
            setAddress(address); // Set the address obtained
            setWalletConnected(true);
        } catch (err) {
            console.error(err);
        }
    };

    // useEffects are used to react to changes in state of the website
    // The array at the end of function call represents what state changes will trigger this effect
    // In this case, whenever the value of `walletConnected` changes - this effect will be called
    useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
            // Assign the Web3Modal class to the reference object by setting it's `current` value
            // The `current` value is persisted throughout as long as this page is open
            web3ModalRef.current = new Web3Modal({
                network: "sepolia",
                cacheProvider: true,
                providerOptions: {},
            });
            connectWallet();
        }
    }, [walletConnected]);

    return (
        <WalletContext.Provider value={{ walletConnected, signer, address, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};