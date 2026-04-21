require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

// 🔥 WEBHOOK PRINCIPAL
app.post('/webhook/whatsapp', async (req, res) => {
  res.status(200).send('OK');

  const payload = req.body;

  if (payload.fromMe) return;

  const phone = payload.phone;
  const text = payload.text?.message || payload.text;

  if (!phone || !text) return;

  console.log(`📩 ${phone}: ${text}`);

  try {
    await sendZAPI(phone, "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar?");
  } catch (err) {
    console.error("Erro Z-API:", err.message);
  }
});

// 🔵 ENVIO Z-API
async function sendZAPI(phone, message) {
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

  await axios.post(url, {
    phone: phone,
    message: message
  });
}

// 🔵 HEALTH CHECK
app.get('/', (req, res) => {
  res.send('API Z-API rodando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
