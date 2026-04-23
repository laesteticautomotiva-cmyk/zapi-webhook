const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "laestetica123";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("META EVENT:", JSON.stringify(body, null, 2));

  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];

    if (message?.type === "text") {
      const from = message.from;
      const text = message.text.body;

      console.log("MENSAGEM RECEBIDA:", text);

     await sendReply(from, `Olá 👋 Seja bem-vindo à LA Estética Automotiva 🚗✨

Como posso te ajudar hoje?

1️⃣ Higienização interna
2️⃣ Polimento / vitrificação
3️⃣ Orçamento
4️⃣ Agendamento
5️⃣ Falar com atendente

Responda com o número da opção desejada.`);
    }

  } catch (err) {
    console.log("ERRO WEBHOOK:", err.message);
  }

  res.sendStatus(200);
});

async function sendReply(to, message) {
  const token = process.env.META_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  console.log("TOKEN OK?", !!token);
  console.log("PHONE ID:", phoneNumberId);
  console.log("DESTINO:", to);

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to.toString(),
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("ENVIADO COM SUCESSO:", res.data);

  } catch (err) {
    console.log("ERRO META:");
    console.log(err.response?.data || err.message);
  }
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("RODANDO NA PORTA", PORT));
