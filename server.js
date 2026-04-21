import axios from "axios";

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
    console.log("📤 ENVIADO COM SUCESSO:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ ERRO META:", error.response?.data || error.message);
  }
}

export default sendMetaWhatsApp;
