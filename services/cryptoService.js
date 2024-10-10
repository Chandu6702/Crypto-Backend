import axios from "axios";
import CryptoData from "../models/cryptoData.js";
import { config } from "dotenv";

config();

async function fetchCryptoData() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,matic-network,ethereum",
          vs_currencies: "usd",
          include_market_cap: true,
          include_24hr_change: true,
        },
      }
    );

    console.log("Fetched Data:", response.data);

    const { bitcoin, "matic-network": matic, ethereum } = response.data;
    const cryptoRecords = [
      {
        coinId: "bitcoin",
        price: bitcoin.usd,
        marketCap: bitcoin.usd_market_cap,
        "24hChange": bitcoin.usd_24h_change,
      },
      {
        coinId: "matic-network",
        price: matic.usd,
        marketCap: matic.usd_market_cap,
        "24hChange": matic.usd_24h_change,
      },
      {
        coinId: "ethereum",
        price: ethereum.usd,
        marketCap: ethereum.usd_market_cap,
        "24hChange": ethereum.usd_24h_change,
      },
    ];

    await Promise.all(
      cryptoRecords.map(async (record) => {
        if (
          record.price !== undefined &&
          record.marketCap !== undefined &&
          record["24hChange"] !== undefined
        ) {
          const existingRecord = await CryptoData.findOne({
            coinId: record.coinId,
          });

          if (!existingRecord || existingRecord.price !== record.price) {
            const updateData = {
              $set: {
                price: record.price,
                marketCap: record.marketCap,
                "24hChange": record["24hChange"],
                createdAt: existingRecord
                  ? existingRecord.createdAt
                  : new Date(),
              },
            };

            if (existingRecord) {
              updateData.$push = {
                history: {
                  price: record.price,
                  timestamp: new Date(),
                },
              };
            }

            const result = await CryptoData.updateOne(
              { coinId: record.coinId },
              updateData,
              { upsert: true }
            );

            console.log(`Updated record for ${record.coinId}:`, result);
          } else {
            console.log(`No price change for ${record.coinId}.`);
          }
        } else {
          console.warn(
            `Skipping record for ${record.coinId} due to missing required fields.`
          );
        }
      })
    );
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

export default fetchCryptoData;
