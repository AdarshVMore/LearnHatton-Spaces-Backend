require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const spaceRoutes = require("./routes/spaceRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api/spaces", spaceRoutes);

app.use(errorHandler);

module.exports = app;
