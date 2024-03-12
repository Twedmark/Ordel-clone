const fs = require("node:fs");
const crypto = require("crypto");
const { readWordsFromFile } = require("../FileOperations/index");

// History JSON file structure
// {
//   "GameHistory": [
//     {
//       "roundNumber": 1,
//       "word": "PHASE",
//     },
//     {
//       "roundNumber": 2,
//       "word": "HELLO",
//     },
//   ],
// }

function pickWordBasedOnDate(date, wordsList) {
  const hash = crypto
    .createHash("sha256")
    .update(date.toISOString().slice(0, 10))
    .digest("hex");
  const index = parseInt(hash, 16) % wordsList.length;
  return wordsList[index];
}

const newRound = () => {
  fs.open("History/history.json", "a", (err, fd) => {
    if (err) {
      console.error("Error opening file:", err);
      return;
    }

    fs.readFile("History/history.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }

      const history = JSON.parse(data);
      const roundNumber = history.GameHistory.length + 1;

      const words = readWordsFromFile("selectedWords.txt");
      let currentDate = new Date();
      // REMOVE THIS LATER
      currentDate.setDate(currentDate.getDate() + roundNumber); // ONLY FOR TESTING
      //REMOVE THIS LATER
      const chosenWord = pickWordBasedOnDate(currentDate, words);

      const newRound = {
        roundNumber,
        word: chosenWord,
      };

      history.GameHistory.push(newRound);

      fs.writeFile(
        "History/history.json",
        JSON.stringify(history, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to file:", err);
            return;
          }
        }
      );
    });

    fs.close(fd, (err) => {
      if (err) {
        console.error("Error closing file:", err);
      }
    });
  });
};

module.exports = {
  newRound,
};
