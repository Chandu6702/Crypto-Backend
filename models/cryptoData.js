import { Schema, model } from "mongoose";

const cryptoDataSchema = new Schema({
  coinId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: Number,
  },
  "24hChange": {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  history: [
    {
      price: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default model("CryptoData", cryptoDataSchema);
