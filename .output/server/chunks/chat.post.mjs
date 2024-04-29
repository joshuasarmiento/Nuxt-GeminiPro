import { d as defineEventHandler, u as useRuntimeConfig, r as readBody } from './nitro/node-server.mjs';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const chat_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let messages = [];
  const previousMessages = await readBody(event);
  messages = messages.concat(previousMessages);
  let prompt = messages.map((message) => `${message.role}: ${message.message}`).join("\n") + `
AI:`;
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
    // Add other categories as needed
  ];
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig,
    safetySettings
  });
  const response = result.response;
  const text = response.text();
  return {
    message: text
  };
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
