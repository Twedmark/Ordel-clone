export default function handler(req, res) {
  console.log("Cron job is running");
  res.status(200).end("Hello Cron!");
}
