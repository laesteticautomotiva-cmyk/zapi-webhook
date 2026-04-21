const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  console.log("🔥 TESTE OK");
  res.json({ ok: true });
});

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("📩 WEBHOOK:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

async function sendMetaWhatsApp(phone, message) {
  const token = process.env.META_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const cleanPhone = phone.toString().replace(/\D/g, "");

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: cleanPhone,
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

    console.log("📤 ENVIADO:", response.data);
    return response.data;
  } catch (err) {
    console.log("❌ ERRO:", err.response?.data || err.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 rodando na porta", PORT));
