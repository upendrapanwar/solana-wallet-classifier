const { getBalance, getTransactionCount } = require("../solana/rpc");

async function classifyWallet(walletAddress) {
  const balance = await getBalance(walletAddress);
  const txCount = await getTransactionCount(walletAddress);

  if (txCount < 10) return { type: "Fresh", balance, txCount };
  if (balance < 3) return { type: "Shrimp", balance, txCount };
  if (balance >= 3 && balance <= 100) return { type: "Fish", balance, txCount };
  if (balance > 100) return { type: "Whale", balance, txCount };

  return { type: "Unknown", balance, txCount };
}

module.exports = { classifyWallet };
