import express, { json } from "express";
import { config } from "dotenv";
import { schedule } from "node-cron";
import connectDB from "./config/db.js";
import fetchCryptoData from "./services/cryptoService.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";

config();

const app = express();
const port = 8080;
connectDB();

app.use(json());
app.use("/api", cryptoRoutes);

// Schedule a task to fetch crypto data every 2 hours
schedule("0 */2 * * *", () => {
  console.log("Fetching crypto data...");
  fetchCryptoData();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Use backticks for interpolation
  fetchCryptoData(); // Initial fetch when the server starts
});
