const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/webhook/whatsapp", async (req, res) => {
  res.status(200).send("ok");

  console.log("📩 Webhook:", req.body);

  const payload = req.body;

  const phone = payload.phone;
  const text = payload.text?.message || payload.text;

  if (!phone || !text) return;

  console.log(`Mensagem de ${phone}: ${text}`);

  await sendZAPI(phone, "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar?");
});

app.get("/", (req, res) => {
  res.send("API Z-API rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

// 🔥 FUNÇÃO FORA DO app.listen (CORRETO)
async function sendZAPI(phone, message) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  try {
    const response = await axios.post(url, {
      phone: phone,
      message: message
    });

    console.log("📤 Mensagem enviada com sucesso:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar Z-API:", error.response?.data || error.message);
  }
}
