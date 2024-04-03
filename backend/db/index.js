require("dotenv").config({ path: "../.env" });
const { MongoClient } = require("mongodb");
const mongoURI = process.env.MONGO_URI;

const dbNameWords = "Words";
const gameHistoryCollectionName = "gameHistory";
const SelectedWordsCollectionName = "selectedWords";
const allowedGuessesCollectionName = "allowedGuesses";

async function getCurrentRound() {
  console.log("getCurrentRound");
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const db = client.db(dbNameWords);
    const collection = db.collection(gameHistoryCollectionName);

    const latestRound = await collection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    console.log(latestRound);

    return latestRound[0];
  } catch (error) {
    console.error("Error getting current round:", error);
  } finally {
    await client.close();
  }
}

async function allowedWord(word) {
  console.log("allowedWord");
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const db = client.db(dbNameWords);
    const collection = db.collection(allowedGuessesCollectionName);

    console.time("searchTime");
    const result = await collection.findOne({ word });
    console.timeEnd("searchTime");

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error searching for word:", error);
  } finally {
    await client.close();
  }
}

// async function newRound() {
//   console.log("newRound");
//   const client = new MongoClient(mongoURI);

//   try {
//     await client.connect();
//     const db = client.db(dbNameWords);
//     const gameHistoryCollection = db.collection(gameHistoryCollectionName);
//     const wordsCollection = db.collection(SelectedWordsCollectionName);

//     const latestRound = await gameHistoryCollection
//       .find()
//       .sort({ _id: -1 })
//       .limit(1)
//       .toArray();

//     const roundNumber =
//       latestRound.length > 0 ? latestRound[0].roundNumber + 1 : 1;

//     const words = await wordsCollection.find().toArray();
//     const chosenWord = words[(roundNumber - 1) % words.length].word;

//     const newRound = {
//       date: new Date().toDateString(),
//       roundNumber,
//       word: chosenWord,
//     };

//     await gameHistoryCollection.insertOne(newRound);
//     return newRound;
//   } catch (error) {
//     console.error("Error updating game history:", error);
//   } finally {
//     await client.close();
//   }
// }

module.exports = { allowedWord, getCurrentRound };
