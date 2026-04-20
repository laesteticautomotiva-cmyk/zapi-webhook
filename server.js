require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN;

app.post('/webhook/whatsapp', async (req, res) => {
  res.status(200).send('OK');

  const payload = req.body;

  // Ignorar mensagens enviadas por você mesmo
  if (payload.fromMe) return;

  const phone = payload.phone;
  const text  = payload.text?.message || payload.text;

  if (!phone || !text) return;

  console.log(`Mensagem de ${phone}: ${text}`);

  // Resposta simples (depois ligamos com sua IA)
  await sendZAPI(phone, "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar?");
});

async function sendZAPI(phone, message) {
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone: phone,
      message: message
    }),
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
