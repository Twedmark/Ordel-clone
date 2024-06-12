export default async function handler(req, res) {
  let text = await newRound();

  res.json(text);
}
