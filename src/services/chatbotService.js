const axios = require("axios");

export async function getChatbotResponse(messages, { model }) {
  const openaiApiKey = "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";
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openaiApiKey}`,
  };

  const data = {
    model: model || "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `Ты чат бот по имени Эмилия` },
      ...messages,
    ],
    temperature: 0.8,
    max_tokens: 400,
  };
  console.log("data", data);

  try {
    const response = await axios.post(apiUrl, data, { headers });
    const assistantMessage = response.data.choices[0].message.content;
    return assistantMessage;
  } catch (error) {
    console.error("Error in getChatbotResponse:", error);
    return "An error occurred. Please try again later.";
  }
}
