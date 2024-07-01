const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const port = 3500;
const allRoutes  = require("./routes/allRoutes");

// Middleware
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
dotenv.config();

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connection established to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB", err);
  });

const PORT = process.env.PORT || port;
const HOST = process.env.HOST || "localhost";

app.get("/", async (req, res) => {
  res.json({message: "Default Route"});
});

app.use(express.json());

app.use("/api", allRoutes);

app.use("/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port https://${HOST}:${PORT}`);
});
