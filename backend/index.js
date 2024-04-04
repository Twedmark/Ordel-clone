require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getCurrentRound, allowedWord, newRound } = require("./db");
const cron = require("node-cron");

const PORT = process.env.PORT || 3001;
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
  console.time("GET allowedWord");

  const responseObj = {
    success: false,
    allCorrect: false,
    guess: req.params.word.split(""),
    result: Array(5).fill(""),
  };

  console.time("DB allowedWord");

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
      getCurrentRound(),
      allowedPromise,
    ]);

    console.timeEnd("DB allowedWord");

    if (isAllowed) {
      responseObj.success = true;

      const correctWord = currentRound.word;

      for (let i = 0; i < 5; i++) {
        const guessChar = responseObj.guess[i].toUpperCase();
        const correctChar = correctWord[i].toUpperCase();

        if (guessChar === correctChar) {
          responseObj.result[i] = "C";
        } else if (correctWord.includes(guessChar)) {
          responseObj.result[i] = "W";
        } else {
          responseObj.result[i] = "-";
        }
      }

      responseObj.allCorrect =
        req.params.word.toUpperCase() === correctWord.toUpperCase();
    }

    console.timeEnd("GET allowedWord");
    res.json(responseObj);
  } catch (error) {
    if (error === false) {
      res.status(200).json({ success: false, error: "Word not allowed" });
      console.timeEnd("GET allowedWord");
    } else {
      console.error("Error processing allowed word:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
      console.timeEnd("GET allowedWord");
    }
  }
});

// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
// });

app.get("/api/test", async (req, res) => {
  console.log("GET /api/test");

  let text = await newRound();

  res.json(text);
});
