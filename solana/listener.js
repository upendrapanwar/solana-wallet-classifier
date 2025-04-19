const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function listenToToken(tokenAddress, handleNewBuyer) {
  connection.onProgramAccountChange(
    new PublicKey(tokenAddress),
    async (info) => {
      // Handle incoming transactions or token activity
      await handleNewBuyer(info);
    },
    "confirmed"
  );
}

module.exports = { listenToToken };