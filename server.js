const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// 🔥 WEBHOOK Z-API
app.post("/webhook/whatsapp", async (req, res) => {
  res.status(200).send("ok");

  console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(req.body, null, 2));

  const payload = req.body;

  const phone = payload.phone;
  const text = payload.text?.message || payload.text;

  console.log("📌 EXTRAÍDO:", { phone, text });

  if (!phone || !text) {
    console.log("❌ Payload inválido");
    return;
  }

  console.log("➡️ Processando resposta...");

  await sendZAPI(
    phone,
    "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar você hoje?"
  );
});

// 🔥 TESTE DE VIDA DO SERVIDOR
app.get("/", (req, res) => {
  res.send("API Z-API rodando 🚀");
});

// 🔥 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta " + PORT);
});

// 🔥 FUNÇÃO DE ENVIO Z-API
async function sendZAPI(phone, message) {
  console.log("🔥 ENVIANDO PARA Z-API...");

  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  console.log("➡️ URL:", url);

  try {
    const response = await axios.post(url, {
      phone: phone,
      message: message,
    });

    console.log("📤 RESPOSTA Z-API:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log(
      "❌ ERRO Z-API:",
      error.response?.data || error.message
    );
  }
}
