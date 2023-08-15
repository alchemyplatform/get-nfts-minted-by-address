// Import necessary modules
const { Alchemy, Network, fromHex } = require("alchemy-sdk");
require('dotenv').config();

// Configure Alchemy SDK with API key and network
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// Address to fetch NFTs from (replace with your own)
const fromAddress = "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1";

// Main function to fetch all NFTS minted by an address
const main = async () => {
    try {
        // Get all transactions for an address from block 0 and store in txns
        const txns = await alchemy.core.getAssetTransfers({
            // filter for minting events
            fromBlock: "0x0",
            fromAddress: fromAddress,
            excludeZeroValue: true,
            category: ["erc721", "erc1155"],
        });

        // Loop through all transactions and print out the token ID and contract address
        for (const events of txns.transfers) {
            if (events.erc1155Metadata == null) {
                console.log("ERC-721 Token Minted:") 
                console.log(" ID: ", events.tokenId)
                console.log(" Contract: ", events.rawContract.address);
            } else {
                for (const erc1155 of events.erc1155Metadata) {
                    console.log("ERC-1155 Token Minted:")
                    console.log(" ID: ", erc1155.tokenId)
                    console.log(" Contract: ", events.rawContract.address);
                }
            }
            console.log("---------------------------");
        }
    
    } catch (error) {
        console.error('Error fetching transaction history:', error);
    }
}

main();
