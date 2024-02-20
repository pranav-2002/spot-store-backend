const express = require("express");
const mongoose = require("mongoose");

const config = require("./config/server");
const rootRouter = require("./api/routes/index");

const app = express();

// For getting the JSON response
app.use(express.json());

/* loading routes start. */
app.get("/api/v1", (req, res) => {
  return res.send("Spot Store API V1");
});

// Routes
app.use("/api/v1", rootRouter);
/* loading routes end. */

/* Server Start */
app.listen(config.server_port, () => {
  console.log(`Server is running on port ${config.server_port}`);
});

/* Connect To MongoDB */
mongoose.connect(config.mongoDB_url);

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

db.once("open", () => {
  console.log("Connected successfully to MongoDB");
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
