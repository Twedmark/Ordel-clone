const express = require("express");
const crypto = require("crypto");
const fs = require("node:fs");

const PORT = process.env.PORT || 3001;

const app = express();

function readWordsFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    // returns to uppercase because the frontend needs the words in uppercase
    return data
      .toUpperCase()
      .split("\n")
      .filter((word) => word.trim() !== "");
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function pickWordBasedOnDate(date, wordsList) {
  const hash = crypto
    .createHash("sha256")
    .update(date.toISOString().slice(0, 10))
    .digest("hex");
  const index = parseInt(hash, 16) % wordsList.length;
  return wordsList[index];
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000");
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api/word", (req, res) => {
  console.log("GET /api/word");
  const words = readWordsFromFile("selectedWords.txt");

  if (words.length === 0) {
    console.log("No words found in the file.");
  } else {
    const currentDate = new Date();
    const chosenWord = pickWordBasedOnDate(currentDate, words);
    res.json({ word: chosenWord });
  }
});
