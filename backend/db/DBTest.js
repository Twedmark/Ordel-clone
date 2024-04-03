require("dotenv").config({ path: "../.env" });
const fs = require("fs");

const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI; // Update with your MongoDB URI

// Database and collection names
const dbName = "Words"; // Update with your database name
const collectionName = "selectedWords"; // Update with your collection name

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// async function shuffleCollection(databaseName, collectionName) {
//   const client = new MongoClient(mongoURI);
//   try {
//     // Connect to MongoDB
//     await client.connect();

//     const database = client.db(databaseName);
//     const collection = database.collection(collectionName);

//     // Retrieve all documents from the collection
//     const documents = await collection.find({}).toArray();

//     // Shuffle the documents
//     shuffleArray(documents);

//     // Delete all documents from the collection
//     await collection.deleteMany({});

//     // Insert the shuffled documents back into the collection
//     await collection.insertMany(documents);

//     console.log("Collection shuffled successfully.");
//   } catch (err) {
//     console.error("Error shuffling collection:", err);
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// }

// shuffleCollection("Words", "selectedWords");

// Function to insert words into the database
async function insertWords(wordsArray) {
  // Create a MongoDB client
  const client = new MongoClient(mongoURI);

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Access the collection
    const collection = db.collection(collectionName);
    // Create an array of objects with word field
    const wordObjects = wordsArray.map((word) => ({ word }));

    // Insert each word object into the collection
    const insertResult = await collection.insertMany(wordObjects);

    console.log(
      `${insertResult.insertedCount} words inserted into the database.`
    );
  } catch (error) {
    console.error("Error inserting words into the database:", error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

// Example usage
const readWordsFromFile = (filename) => {
  try {
    // const configDirectory = path.join(process.cwd(), filename);
    // const data = fs.readFileSync(configDirectory, "utf8");

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
};

// insertWords(readWordsFromFile("../selectedWords.txt"));

async function testMultipleWordSearch(words) {
  // Create a MongoDB client
  const client = new MongoClient(mongoURI);

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Access the collection
    const collection = db.collection(collectionName);

    // Array to store search times
    const searchTimes = [];

    // Perform searches for each word
    for (const word of words) {
      // Start the timer
      var t0 = performance.now();

      // Search for the word
      const result = await collection.findOne({ word });

      // Stop the timer, Get the elapsed time
      var t1 = performance.now();
      console.log("Time " + (t1 - t0) + " milliseconds.");

      if (result) {
        console.log(`Found word: ${word}`);
      } else {
        console.log(`Word not found: ${word}`);
      }

      // Add the elapsed time to the array
      searchTimes.push(t1 - t0);
    }

    // Calculate the average search time
    const averageSearchTime =
      searchTimes.reduce((sum, time) => sum + time, 0) / searchTimes.length;

    console.log(
      `Average search time for ${
        words.length
      } words: ${averageSearchTime.toFixed(2)} milliseconds`
    );
  } catch (error) {
    console.error("Error searching for words:", error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

// Example usage: Test searching for multiple words
const wordsToSearch = [
  "PHASE",
  "SLIMY",
  "BRINK",
  "VOBLA",
  "TOXIC",
  "BRUTE",
  "THINK",
  "BOOBS",
  "PANTS",
  "HOGOS",
  "DELVE",
  "HAMES",
  "HOUSE",
  "BIBIS",
  "YOGIN",
  "LOOKS",
  "AIMAG",
  "ZYMES",
]; // Update with the words you want to search for
// testMultipleWordSearch(wordsToSearch);

async function testQueries() {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gameHistory");

    const query = { round: 1 };

    const cursor = collection.find(query);

    const results = await cursor.toArray();

    console.log(results);
  } catch (error) {
    console.error("Error searching for word:", error);
  }
}
