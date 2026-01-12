const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// THIS LINE IS MISSING OR WRONG
app.use("/api/kyc", require("./routes/kycRoutes"));

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
