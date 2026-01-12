require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Mongo error", err));

app.use("/api/kyc", require("./routes/kycRoutes"));

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
