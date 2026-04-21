async function sendZAPI(phone, message) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  console.log("➡️ Enviando para Z-API:", { phone, message });

  try {
    const response = await axios.post(url, {
      phone: phone,
      message: message
    });

    console.log("📤 RESPOSTA Z-API:", response.data);
  } catch (error) {
    console.log("❌ ERRO REAL Z-API:");
    console.log(error.response?.data || error.message);
  }
}
