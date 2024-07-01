require("dotenv").config({ path: "../.env" });
const { MongoClient } = require("mongodb");
const mongoURI = process.env.MONGO_URI;

const dbNameWords = "Words";
const gameHistoryCollectionName = "gameHistory";
const allowedGuessesCollectionName = "allowedGuesses";
const SelectedWordsCollectionName = "selectedWords";

const client = new MongoClient(mongoURI, {});

async function getCurrentRound() {
  console.log("getCurrentRound");

  try {
    await client.connect();
    const db = client.db(dbNameWords);
    const collection = db.collection(gameHistoryCollectionName);

    const latestRound = await collection.findOne({}, { sort: { _id: -1 } });
    return latestRound;
  } catch (error) {
    console.error("Error getting current round:", error);
  }
}

async function allowedWord(word) {
  console.log("allowedWord");

  try {
    await client.connect();
    const db = client.db(dbNameWords);
    const collection = db.collection(allowedGuessesCollectionName);
    console.log("word", word);

    let options;
    if (word[0] === RegExp(/[A-M]/i)) {
      options = { sort: { word: 1 } };
    } else {
      options = { sort: { word: -1 } };
    }

    const result = await collection.findOne({ word: word }, null, options);

    return !!result;
  } catch (error) {
    console.error("Error searching for word:", error);
  }
}

async function newRound() {
  console.log("newRound");
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const db = client.db(dbNameWords);
    const gameHistoryCollection = db.collection(gameHistoryCollectionName);
    const wordsCollection = db.collection(SelectedWordsCollectionName);

    const latestRound = await gameHistoryCollection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const roundNumber =
      latestRound.length > 0 ? latestRound[0].roundNumber + 1 : 1;

    const words = await wordsCollection.find().toArray();
    const chosenWord = words[(roundNumber - 1) % words.length].word;
    console.log("Chosen word ", chosenWord);

    const newRound = {
      date: new Date().toDateString(),
      roundNumber,
      word: chosenWord,
    };

    let insert = await gameHistoryCollection.insertOne({ ...newRound });
    console.log("Insert one ", insert);
    return newRound;
  } catch (error) {
    console.error("Error updating game history: ", error);
  } finally {
    await client.close();
  }
}

module.exports = { newRound, allowedWord, getCurrentRound };
