
// Importa ethers utilizando la sintaxis de módulos
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();
const providerUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
const _contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

console.log("PROVIDER: ", process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);
console.log("ADDRESS: ", process.env.NFT_CONTRACT_ADDRESS);
console.log("ADDRESS2: ", _contractAddress);
// Importa la ABI del contrato
import * as fs from 'fs';

// Lee el archivo JSON de la ABI del contrato
const contractABI = JSON.parse(fs.readFileSync('../contractABI.json', 'utf8'));
const abi = contractABI.abi;

// Dirección del contrato desplegado
const contractAddress = '0x22116E0fdC5Ff9933555e540299d2241ACFC436E';

// Proveedor de la red (puedes elegir el proveedor que estás utilizando)
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/QF_rlvr4V0ZORimK7ysBA4mJvl0Bk47c');


// Instancia del contrato
const contract = new ethers.Contract(contractAddress, abi, provider);

// Función para obtener el valor de sellOfferIdCounter
async function getSellOfferIdCounter() {
    try {
        const sellOfferIdCounter = await contract.sellOfferIdCounter();
        console.log('sellOfferIdCounter:', sellOfferIdCounter.toString());
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Llamada a la función
getSellOfferIdCounter();

//INCLUIR EN PACKAGE.JSON
//,
// "type": "module"