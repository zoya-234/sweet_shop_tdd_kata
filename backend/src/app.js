const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Allow frontend origins
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local React frontend
      "https://sweet-shop-frontend-zq65.onrender.com", // future deployed frontend
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const sweetRoutes = require("./routes/sweet.routes");

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

module.exports = app;
