import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔥 TESTE PRA VER SE O SERVIDOR ESTÁ NO AR
app.get("/test", (req, res) => {
  console.log("🔥 TESTE OK - SERVIDOR RODANDO");
  res.json({ ok: true, status: "server running" });
});

// 🔐 VERIFICAÇÃO DA META (OBRIGATÓRIO)
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    console.log("🔗 WEBHOOK VERIFICADO PELA META");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// 📩 RECEBER MENSAGENS DA META
app.post("/webhook", (req, res) => {
  console.log("📩 WEBHOOK RECEBIDO:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

// 🚀 ENVIO DE MENSAGEM (META CLOUD API)
async function sendMetaWhatsApp(phone, message) {
  const token = process.env.META_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const cleanPhone = phone.toString().replace(/\D/g, "");

  const data = {
    messaging_product: "whatsapp",
    to: cleanPhone,
    type: "text",
    text: {
      body: message
    }
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("📤 ENVIADO:", response.data);
    return response.data;
  } catch (err) {
    console.log("❌ ERRO ENVIO:", err.response?.data || err.message);
  }
}

// 🔌 PORTA RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
});
