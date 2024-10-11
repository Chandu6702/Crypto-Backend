import { Router } from "express";
import CryptoData from "../models/cryptoData.js";

const router = Router();

//route to get status of crypto
router.get("/stats", async (req, res) => {
  const { coin } = req.query;
  try {
    const record = await CryptoData.findOne({ coinId: coin });
    if (!record) {
      return res.status(404).json({ error: `No data found for coin: ${coin}` });
    }
    res.json({
      price: record.price,
      marketCap: record.marketCap,
      "24hChange": record["24hChange"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//route to get deviation of crypto
router.get("/deviation", async (req, res) => {
  const { coin } = req.query;
  try {
    const record = await CryptoData.findOne({ coinId: coin }).sort({
      createdAt: -1,
    });

    if (!record) {
      return res
        .status(400)
        .json({ error: "Not enough data points to calculate deviation" });
    }

    const prices = record.history.map((item) => item.price);

    if (prices.length < 2) {
      return res
        .status(400)
        .json({ error: "No prices found in the history for the given record" });
    }

    const { mean, stdDev } = calculateDeviation(prices);
    res.json({ mean, stdDev });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//To calculate the deviation of prices
function calculateDeviation(prices) {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const deviations = prices.map((price) => Math.pow(price - mean, 2));
  const variance =
    deviations.reduce((sum, deviation) => sum + deviation, 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev };
}

export default router;
