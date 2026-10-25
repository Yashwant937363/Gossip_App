import { apiChatbot, apiAnalyzeImage, apiTranslate, apiSummarize } from "../api/client";

export async function sendChatBotPrompt({
  message,
  tone,
  history,
}: {
  message: string;
  uid?: string;
  tone?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const result = await apiChatbot({
    message,
    tone: tone?.toLowerCase(),
    history,
  });
  return {
    reply: result.reply,
    response: {
      content: result.reply,
    },
    tone: result.tone,
  };
}

export async function getImageDescription({
  url,
  prompt,
}: {
  url: string;
  prompt?: string;
}) {
  const result = await apiAnalyzeImage({ url, prompt });
  return result.data;
}

export async function translateMessages({
  messages,
  to,
}: {
  messages: Array<{ id: string; text: string }>;
  to: string;
}) {
  return await apiTranslate({ messages, to });
}

export async function summarizeConversation({
  conversation,
  format,
}: {
  conversation: Array<{ username: string; message: string }>;
  format?: string;
}) {
  return await apiSummarize({ conversation, format });
}
