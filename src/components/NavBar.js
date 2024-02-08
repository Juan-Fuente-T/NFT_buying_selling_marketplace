import Image from 'next/image';
import Head from "next/head";
import styles from "../styles/NavBar.module.css";
import { WalletContext } from "./WalletContext";

import React, { useContext, useEffect, useRef, useState } from "react";


const NavBar = () => {
    const { walletConnected, connectWallet } = useContext(WalletContext);



    return (
        <nav>
            <div>
                <div className={styles.container}>
                    <img src="/pop_logo.png" className={styles.image_logo} alt="Logo_de_app_de_compra_venta_de_NFTs" />
                    <h1 className={styles.title}>
                        Welcome to Marketplace Blockcoder App {/*address*/}!
                    </h1>
                    {walletConnected ? (
                        <div>Wallet connected</div>
                    ) : (
                        <button onClick={connectWallet} className={styles.button}>
                            Connect your wallet
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default NavBar;


/**
 * otra opcion navBar
 * 
 * Sí, puedes mantener la lógica de conexión en el NavBar y aún así reutilizarla en toda la aplicación. Aquí hay una adaptación de la sugerencia para tu caso específico, manteniendo la lógica de conexión en el NavBar:

1. Modificar NavBar para Utilizar el Contexto:

jsx
Copy code
import React, { useContext } from 'react';
import { WalletContext } from './App';
import Web3Modal from 'web3modal';

const NavBar = () => {
  const { walletConnected, connectWallet, signer } = useContext(WalletContext);

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    try {
      // Lógica para conectar la billetera y obtener el Signer
      // Utiliza web3ModalRef.current.connect() para obtener el provider
      // ...

      // Almacenar el Signer en el estado
      setSigner(signer);
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Resto del código del NavBar
};
2. Modificar PopUpForm para Utilizar el Contexto:

jsx
Copy code
import React, { useContext } from 'react';
import { WalletContext } from './App';

const PopupForm = ({ onClose, onSubmit }) => {
  const { signer, connectWallet } = useContext(WalletContext);

  // Resto del código del PopUpForm
};
 * 
 */

/**
 * alternativa
 *  Levantar el Estado a un Nivel Superior:

jsx
Copy code
// App.js o tu componente principal
import React, { useState } from 'react';
import { ethers } from 'ethers';

export const WalletContext = React.createContext();

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    // Lógica para conectar la billetera y obtener el Signer
    // ...

    // Almacenar el Signer en el estado
    setSigner(signer);
    setWalletConnected(true);
  };

  return (
    <WalletContext.Provider value={{ walletConnected, signer, connectWallet }}>
      
      </WalletContext.Provider>
      );
    };
    
    export default App;
    2. Modificar NavBar para Utilizar el Contexto:
    
    jsx
    Copy code
    import React, { useContext } from 'react';
    import { WalletContext } from './App';
    
    const NavBar = () => {
      const { walletConnected, connectWallet } = useContext(WalletContext);
    
      // Resto del código del NavBar
    };
    3. Modificar PopUpForm para Utilizar el Contexto:
    
    jsx
    Copy code
    import React, { useContext } from 'react';
    import { WalletContext } from './App';
    
    const PopupForm = ({ onClose, onSubmit }) => {
      const { signer, connectWallet } = useContext(WalletContext);
    
      // Resto del código del PopUpForm
    };
    Esta estructura permite compartir el estado del Signer entre componentes utilizando el contexto de React, lo que significa que los usuarios solo necesitarán conectar su billetera una vez durante la sesión de la aplicación.
    
    
    
    
 */