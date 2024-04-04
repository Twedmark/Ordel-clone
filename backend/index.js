require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getCurrentRound, allowedWord } = require("./db");
const { newRound } = require("./cron");

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

app.use("/cron", newRound);

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.get("/api/word", async (req, res) => {
  console.log("GET /api/word");
  const round = await getCurrentRound();
  res.json(round);
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
    console.error("Error processing allowed word:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
    console.timeEnd("GET allowedWord");
  }
});

app.get("/api/test", (req, res) => {
  console.log("GET /api/test");

  let text = newRound();

  res.json({ success: true });
});
