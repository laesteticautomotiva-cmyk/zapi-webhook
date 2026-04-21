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

  await sendZAPI(
    phone,
    "Olá! 👋 Sou a Lara da LA Estética Automotiva. Como posso ajudar?"
  );
});

async function sendZAPI(phone, message) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  try {
    const response = await axios.post(
      url,
      {
        phone,
        message
      },
      {
        headers: {
          "Client-Token": "E1982A98C5F7CE2B4DC0F2F4"
        }
      }
    );

    console.log("📤 ENVIADO COM SUCESSO:", response.data);
  } catch (error) {
    console.log("❌ ERRO Z-API:", error.response?.data || error.message);
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});
