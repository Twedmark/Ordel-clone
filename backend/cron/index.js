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

    const newRound = {
      date: new Date().toDateString(),
      roundNumber,
      word: chosenWord,
    };

    await gameHistoryCollection.insertOne(newRound);
  } catch (error) {
    console.error("Error updating game history:", error);
  } finally {
    await client.close();
  }
}

module.exports = { newRound };
