const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Z-API rodando 🚀");
});

app.post("/webhook/whatsapp", async (req, res) => {
  res.status(200).send("ok");

  console.log("📩 RECEBIDO:", JSON.stringify(req.body));

  const phone = req.body.phone;
  const text = req.body.text?.message;

  if (!phone || !text) return;

  console.log("➡️ respondendo...");

  await sendZAPI(phone);
});

async function sendZAPI(phone) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  try {
    const r = await axios.post(url, {
      phone,
      message: "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar?"
    });

    console.log("📤 ENVIADO COM SUCESSO:", r.data);
  } catch (e) {
    console.log("❌ ERRO Z-API:", e.response?.data || e.message);
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});
