# Crypto-Backend

This project is a backend API that fetches cryptocurrency data using the CoinGecko API and stores it in a MongoDB database. It schedules periodic updates to the data using node-cron and provides endpoints to retrieve the current price, market cap, and price deviation for selected cryptocurrencies.

# Features

->Fetches cryptocurrency prices, market cap, and 24-hour change using CoinGecko API.

->Stores the data in MongoDB with periodic updates.

->Provides endpoints to access the current stats of supported cryptocurrencies.

->Calculates standard deviation of cryptocurrency prices over the last 100 records.

# API Endpoints

1.Fetches current price, market cap, and 24-hour price change for a specific cryptocurrency.

/api/stats?coin=

2.Fetches the deviation of the price for specific cryptocurrency.

/api/deviation?coin=
