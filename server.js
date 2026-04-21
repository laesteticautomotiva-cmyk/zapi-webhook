async function sendZAPI(phone, message) {
  console.log("INSTANCE:", process.env.ZAPI_INSTANCE_ID);
  console.log("TOKEN:", process.env.ZAPI_TOKEN);

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
