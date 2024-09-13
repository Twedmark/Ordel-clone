require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  getCurrentRound,
  getCurrentWord,
  allowedWord,
  newRound,
  currentRoundWin,
  currentRoundLoss,
} = require("../libs");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://twedmarkwordle.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.get("/api/word", async (req, res) => {
  console.log("GET /api/word");
  const round = await getCurrentRound();
  // setTimeout(async () => {
  res.json(round);
  // }, 3000);
});

app.get("/api/allowedWord/:word", async (req, res) => {
  console.log("get /api/allowedWord");

  const responseObj = {
    success: false,
    allCorrect: false,
    guess: req.params.word.split(""),
    result: Array(5).fill(""),
  };

  // const wait = (t) => new Promise((resolve, reject) => setTimeout(resolve, t));
  // const wait2sec = await wait(6000);

  try {
    const allowedPromise = new Promise((resolve, reject) => {
      allowedWord(req.params.word)
        .then((result) => {
          result ? resolve(true) : reject(false);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const [currentRound, isAllowed] = await Promise.all([
      getCurrentWord(),
      allowedPromise,
    ]);

    if (isAllowed) {
      responseObj.success = true;

      let correctWord = currentRound.word;

      for (let i = 0; i < 5; i++) {
        const guessChar = responseObj.guess[i].toUpperCase();
        const correctChar = correctWord[i].toUpperCase();

        if (guessChar === correctChar) {
          responseObj.result[i] = "C";
          correctWord = correctWord.replace(guessChar, "-");
        } else if (correctWord.includes(guessChar)) {
          responseObj.result[i] = "W";
          correctWord = correctWord.replace(guessChar, "-");
        } else {
          responseObj.result[i] = "-";
        }
      }

      responseObj.allCorrect =
        req.params.word.toUpperCase() === currentRound.word.toUpperCase();
    }

    res.json(responseObj);
  } catch (error) {
    if (error === false) {
      res.status(200).json({ success: false, error: "Word not allowed" });
    } else {
      console.error("Error processing allowed word:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
});

app.get("/api/win/:activeRow", async (req, res) => {
  console.log("GET /api/win");
  console.log(req.params.activeRow);

  const stats = await currentRoundWin(req.params.activeRow);

  res.json(stats);
});

app.get("/api/loss", async (req, res) => {
  console.log("GET /api/loss");

  const losses = await currentRoundLoss();

  res.json(losses);
});

module.exports = app;
