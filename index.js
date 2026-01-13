import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import kycRoutes from "./routes/kyc.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.error("Mongo Error", err));

app.get("/health", (req, res) => {
  res.json({ status: "OK", mongo: mongoose.connection.readyState });
});

app.use("/api/kyc", kycRoutes);

app.listen(4000, () => console.log("KYC Service running"));
