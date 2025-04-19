const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function getBalance(walletAddress) {
  const publicKey = new PublicKey(walletAddress);
  const lamports = await connection.getBalance(publicKey);
  return lamports / 1e9; // Convert to SOL
}

async function getTransactionCount(walletAddress) {
  const publicKey = new PublicKey(walletAddress);
  const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 10 });
  return confirmedSignatures.length;
}

module.exports = { getBalance, getTransactionCount };
