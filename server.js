const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/webhook/whatsapp", async (req, res) => {
  res.status(200).send("ok");

  console.log("Webhook recebido:", req.body);
});

app.get("/", (req, res) => {
  res.send("API Z-API rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
