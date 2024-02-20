import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import NFTGallery from '../components/NFTGallery';
import PopupForm from '../components/PopUpForm';
import AppUseSection from '../components/AppUse';
import styles from "../styles/Home.module.css";
import { WalletProvider } from '../components/WalletContext';


/*const getTokenMetadataById = async () => {
  try {
    // Get the provider from web3Modal, which in our case is MetaMask
    // No need for the Signer here, as we are only reading state from the blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);
      // Obtén la dirección del propietario del NFT
      const actualOwner = await nftContract.ownerOf(tokenId);

      // Comprueba si la dirección proporcionada coincide con la dirección del propietario
      if (actualOwner.toLowerCase() !== ownerAddress.toLowerCase()) {
        throw new Error('La dirección proporcionada no es la propietaria del NFT');
      }
  
      // Obtén el URI del token para este ID de token
      const tokenURI = await nftContract.tokenURI(tokenId);
  
      // Obten la metadata del tokenURI
      const response = await fetch(tokenURI);
      const metadataResponse = await response.json();
  
      // Actualiza el estado con la nueva metadata
      setTokenMetadatas({ [tokenId]: metadataResponse });
   } catch (err) {
      console.error(err);
   }
  };*/


const HomePage = () => {
  const [nftsData, setNFTsData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = (formData) => {
    // Enviar los datos al backend o realizar acciones necesarias
    setNFTsData(formData);
    console.log('Datos del formulario:', formData);
    console.log('Datos de NFTSDATA:', nftsData);
  };
  /*
    // You can fetch NFT data from your smart contract here using useEffect
  
    const handleAcceptOffer = (nftId, offerType) => {
      // Implement logic to call the corresponding smart contract function
      console.log(`Accepted ${offerType} offer for NFT ${nftId}`);
    };
  */

  async function getNFTMetadata(nftAddress, tokenId, networkId) {




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

  return (
    <WalletProvider>
      <div>
        <NavBar />
        <div className={styles.intro_gallery}>
          <img className={styles.container_image} src='./Marketplace_Compra_Venta_NFT_JuanFuente.jpg' />
          <div className={styles.container_title}>
            <h2 className={styles.nft_title}>Compra venta de NFTs </h2>
            <h2 className={styles.nft_feature}>Vende los NFT que ya no quieras. Compra los NFT que desees. </h2>
            <div className={styles.nft_characteristics}>
              <p className={styles.nft_feature}> Rápido</p>
              <p className={styles.nft_feature}> Eficiente</p>
              <p className={styles.nft_feature}> Seguro</p>
            </div>
          </div>
        </div>
        {/*<NFTGallery nfts={SAMPLE_NFTS} nftsData={nftsData} onAcceptOffer={handleAcceptOffer} />*/}
        <div>
          <div className={styles.container_form}>
            <div className={styles.container_form_button}>
              <div>
                <h2 className={styles.text_form_button}>¿Quieres comprar o vender un NFT?</h2>
              </div>

              <button className={styles.form_button} onClick={handleOpenPopup}>Crear oferta</button>

              {isPopupOpen && (
                <PopupForm onClose={handleClosePopup} onSubmit={handleFormSubmit} />
              )}
            </div>
          </div>
        </div>
        <NFTGallery nftsData={nftsData} />
        <div>
          <div className={styles.appUse_section}>
            <AppUseSection
              icon="./icono1.png"
              title="Ofertas de Venta"
              description="Vende tu Nft indicando la dirección,  el Id, su precio y fecha tope."
            />
            <AppUseSection
              icon="./icono2.png"
              title="Ofertas de Compra"
              description="Publica el Nft que desees, indicando el precio que deseas pagar."
            />
            <AppUseSection
              icon="./icono3.png"
              title="Aceptar Ofertas"
              description="Acepta ofertas de venta, enviando el precio, o de compra recibiendo el valor"
            />
            <AppUseSection
              icon="./icono4.png"
              title="Cancelar Ofertas"
              description="Cancela pasada la fecha límite, recuperando el ether depositado y la titularidad del NFT."
            />
          </div>
        </div>
        {/*<PopupForm />*/}
        <footer className={styles.footer}>
          Made with &#10084; by Juan Fuente
        </footer>
      </div>
    </WalletProvider>
  );
};

export default HomePage;


/*import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}*/
