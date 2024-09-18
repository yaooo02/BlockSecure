
import { Alchemy, Network } from "alchemy-sdk";

// Alchemy configuration
const config = {
  apiKey: "8Dg4WWIDfGiYBVau4PHwtoQDRSqihXIQ",
  network: Network.ARB_SEPOLIA,
};

const alchemy = new Alchemy(config);

// Replace with address to check
// const address = "0x337d06548671CdD0d0c7B6b71542852676B02E77"; //empty account [0xD801834B38Af6d4a11e1D67C0928CaB8964673cF]
const address = ""; 

// Function to fetch asset transfers
export const fetchAssetTransfers = async (address) => {
  try {
    const resTo = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: address,
        excludeZeroValue: false,
        category: ['external', 'erc20', 'erc721', 'erc1155'], //check for all kind of transactions
    });
    // Fetch transactions where address is the sender
    const resFrom = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        excludeZeroValue: false,
        category: ['external', 'erc20', 'erc721', 'erc1155'],
    });
    
    // Combine both results
    const allTransfers = [...resTo.transfers, ...resFrom.transfers];
    // console.log("Number of transfers: ", allTransfers.length);
    // console.log(allTransfers);
    return allTransfers.length; // only return the count of transfers
} catch (error) {
    console.error('Error fetching asset transfers: ', error);
    return 0;
  }
};

fetchAssetTransfers(address);