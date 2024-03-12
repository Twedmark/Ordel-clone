const express = require("express");
const { newRound } = require("./History/index");
const { getCurrentWord, readWordsFromFile } = require("./FileOperations/index");

const PORT = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api/word", (req, res) => {
  console.log("GET /api/word");

  const word = getCurrentWord();
  console.log(word);

  // res.json({ word });
});

app.get("/api/allowedWord/:word", async (req, res) => {
  console.log("get /api/allowedWord");

  const responseObj = {
    success: false,
    allCorrect: false,
    lettersInRightPlace: Array(5).fill(""),
    lettersInWrongPlace: Array(5).fill(""),
    triedLetters: [],
  };

  const words = readWordsFromFile("allowedGuesses.txt");

  if (words.includes(req.params.word)) {
    responseObj.success = true;

    const correctWord = await getCurrentWord();

    for (let i = 0; i < 5; i++) {
      if (req.params.word[i].toUpperCase() === correctWord[i].toUpperCase()) {
        responseObj.lettersInRightPlace[i] = req.params.word[i].toUpperCase();
      } else if (correctWord.includes(req.params.word[i])) {
        responseObj.lettersInWrongPlace[i] = req.params.word[i].toUpperCase();
      } else if (!responseObj.triedLetters.includes(req.params.word[i])) {
        responseObj.triedLetters.push(req.params.word[i].toUpperCase());
      }

      // if (req.params.word[i].toUpperCase() === correctWord[i].toUpperCase()) {
      //   if (!responseObj.lettersInRightPlace.includes(req.params.word[i])) {
      //     responseObj.lettersInRightPlace.push(
      //       req.params.word[i].toUpperCase()
      //     );
      //   }
      // } else if (correctWord.includes(req.params.word[i])) {
      //   if (!responseObj.lettersInWrongPlace.includes(req.params.word[i])) {
      //     responseObj.lettersInWrongPlace.push(
      //       req.params.word[i].toUpperCase()
      //     );
      //   }
      // } else if (!responseObj.triedLetters.includes(req.params.word[i])) {
      //   responseObj.triedLetters.push(req.params.word[i].toUpperCase());
      // }
    }

    if (req.params.word === correctWord) {
      responseObj.allCorrect = true;
    }

    console.log(responseObj);
    res.json(responseObj);
  } else {
    console.log(responseObj);
    res.json({ success: false });
  }
});

app.get("/api/test", (req, res) => {
  console.log("GET /api/test");

  let text = newRound();

  res.json({ success: true });
});
