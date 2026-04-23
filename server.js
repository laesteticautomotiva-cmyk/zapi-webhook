const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "laestetica123";

// ================== VERIFICAÇÃO META ==================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ================== RECEBER MENSAGEM ==================
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
      const contactName = value?.contacts?.[0]?.profile?.name || "";

      console.log("MENSAGEM RECEBIDA:", text);

      const respostaIA = await getBase44Response({
        phone: from,
        name: contactName,
        message: text
      });

      await sendReply(from, respostaIA);
    }

  } catch (err) {
    console.log("ERRO WEBHOOK:", err.response?.data || err.message);
  }

  res.sendStatus(200);
});

// ================== BASE44 ==================
async function getBase44Response({ phone, name, message }) {
  const base44Url = process.env.BASE44_CHATBOT_URL;
  const secret = process.env.BASE44_SECRET;

  console.log("BASE44 URL:", base44Url);
  console.log("SECRET OK?", !!secret);

  if (!base44Url) {
    throw new Error("BASE44_CHATBOT_URL não configurada");
  }

  if (!secret) {
    throw new Error("BASE44_SECRET não configurada");
  }

  const url = `${base44Url}?secret=${secret}`;

  try {
    const res = await axios.post(url, {
      contact_phone: phone,
      contact_name: name || "",
      message_text: message,
      whatsapp_number: "+5511914987210"
    });

    console.log("RESPOSTA BASE44:", res.data);

    return res.data.response || "Não consegui responder agora.";
    
  } catch (err) {
    console.log("ERRO BASE44:", err.response?.data || err.message);

    return "Desculpe, estou com instabilidade agora. Tente novamente em instantes 🙏";
  }
}

// ================== ENVIAR WHATS ==================
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
    console.log("ERRO META:", err.response?.data || err.message);
  }
}

// ================== SERVER ==================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("RODANDO NA PORTA", PORT);
});
