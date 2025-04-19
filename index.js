const express = require("express");
const { listenToToken } = require("./solana/listener");
const { addBuyer, getBuyers, getBuyersData } = require("./services/buyerService");
const { addWalletToClassify } = require("./jobs/classifyQueue");

const app = express();
app.use(express.json());

app.post("/scan", async (req, res) => {
  const { tokenAddress } = req.body;
  
  listenToToken(tokenAddress, async (info) => {
    const walletAddress = info.accountId.toBase58();
    await addBuyer(tokenAddress, walletAddress);
    await addWalletToClassify(tokenAddress, walletAddress);
  });

  res.json({ message: "Started listening for token buyers!" });
});

app.get("/buyers/:tokenAddress", async (req, res) => {
  const tokenAddress = req.params.tokenAddress;
  const buyers = await getBuyers(tokenAddress);

  const buyersData = await getBuyersData(tokenAddress, buyers);
  res.json(buyersData);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
