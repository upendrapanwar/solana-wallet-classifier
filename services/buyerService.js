const redis = require("../cache/redis");
const db = require("../db/db");

const FIRST_20_BUYERS_KEY = (tokenAddress) => `buyers:${tokenAddress}`;

async function addBuyer(tokenAddress, walletAddress) {
  const key = FIRST_20_BUYERS_KEY(tokenAddress);
  const buyers = await redis.lrange(key, 0, -1);

  if (buyers.includes(walletAddress)) return;
  if (buyers.length >= 20) return;

  await redis.rpush(key, walletAddress);
  console.log(`Added new buyer: ${walletAddress}`);
}

async function getBuyers(tokenAddress) {
  return await redis.lrange(FIRST_20_BUYERS_KEY(tokenAddress), 0, -1);
}

async function getBuyersData(tokenAddress, buyers) {

  if (!buyers.length) {
    return [];
  }  

  const query = `
    SELECT wallet_address, classification
    FROM buyers
    WHERE token_address = $1
    AND wallet_address = ANY($2::text[])
  `;
  
  const { rows } = await db.query(query, [tokenAddress, buyers]);

  const infoMap = {};
  rows.forEach(row => {
    infoMap[row.wallet_address] = {
      classification: row.classification,
    };
  });

  const result = buyers.map(wallet => ({
    walletAddress: wallet,
    walletType: infoMap[wallet]?.classification || "Dev",
  }));

  return result;
}

module.exports = { addBuyer, getBuyers, getBuyersData };
