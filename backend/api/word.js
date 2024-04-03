require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getCurrentRound } = require("../db");

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/api/word", async (req, res) => {
  console.log("GET /api/word");
  const round = await getCurrentRound();
  res.json(round);
});
