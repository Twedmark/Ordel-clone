require("dotenv").config();
const path = require("path");
const fs = require("fs");

const express = require("express");
const {
  newRound,
  getCurrentRound,
  readWordsFromFile,
} = require("../FileOperations/index");
const PORT = process.env.PORT || 3001;
const app = express();

const BASE_URL = process.env.ORIGIN || "https://localhost:3000";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", BASE_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/", (req, res) => {
  const configDirectory = path.join(process.cwd(), "allowedGuesses.txt");
  const data = fs.readFileSync(configDirectory, "utf8");

  res.json(data);
});

app.get("/api/word", (req, res) => {
  console.log("GET /api/word");

  const round = getCurrentRound();

  res.json(round);
});

app.get("/api/allowedWord/:word", async (req, res) => {
  console.log("get /api/allowedWord");

  const responseObj = {
    success: false,
    allCorrect: false,
    guess: req.params.word.split(""),
    result: Array(5).fill(""),
  };

  const words = readWordsFromFile("allowedGuesses.txt");

  console.log(words);

  if (words.includes(req.params.word)) {
    responseObj.success = true;

    const correctWord = await getCurrentRound().word;

    for (let i = 0; i < 5; i++) {
      if (responseObj.guess[i].toUpperCase() === correctWord[i].toUpperCase()) {
        responseObj.result[i] = "C";
      } else if (correctWord.includes(responseObj.guess[i])) {
        responseObj.result[i] = "W";
      } else {
        responseObj.result[i] = "-";
      }
    }

    if (req.params.word === correctWord) {
      responseObj.allCorrect = true;
    }

    console.log(responseObj);
    res.json(responseObj);
  } else {
    res.json({ success: false });
  }
});

app.get("/api/test", (req, res) => {
  console.log("GET /api/test");

  let text = newRound();

  res.json({ success: true });
});
