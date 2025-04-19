const Queue = require("bull");
const { classifyWallet } = require("../services/classify");
const db = require("../db/db");

const classifyQueue = new Queue("classify-wallets");

classifyQueue.process(async (job) => {
  const { tokenAddress, walletAddress } = job.data;

  const { type, balance, txCount } = await classifyWallet(walletAddress);

  await db.query(
    "INSERT INTO buyers (token_address, wallet_address, classification, balance, transaction_count) VALUES ($1, $2, $3, $4, $5)",
    [tokenAddress, walletAddress, type, balance, txCount]
  );
});

async function addWalletToClassify(tokenAddress, walletAddress) {
  await classifyQueue.add({ tokenAddress, walletAddress });
}

module.exports = { addWalletToClassify };
