const fs = require("fs");
const path = require("path");

const readWordsFromFile = (filename) => {
  try {
    const data = fs.readFileSync(path.resolve(filename), "utf8");
    // returns to uppercase because the frontend needs the words in uppercase
    return data
      .toUpperCase()
      .split("\n")
      .filter((word) => word.trim() !== "");
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

const getCurrentRound = () => {
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, "../History/history.json"),
      "utf8"
    );

    const history = JSON.parse(data);
    const currentRound = history.GameHistory[history.GameHistory.length - 1];

    return currentRound;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

module.exports = {
  readWordsFromFile,
  getCurrentRound,
};
