app.get("/webhook", (req, res) => {
  console.log("ENV VERIFY_TOKEN:", process.env.VERIFY_TOKEN);
  console.log("TOKEN RECEBIDO:", req.query["hub.verify_token"]);

  const verify_token = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});
