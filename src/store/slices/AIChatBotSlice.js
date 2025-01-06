import { createSlice } from "@reduxjs/toolkit";

const AiChatBotSlice = createSlice({
  name: "chatbot",
  initialState: {
    tones: [
      "Formal",
      "Sarcastic",
      "Friendly",
      "Enthusiastic",
      "Professional",
      "Casual",
      "Humorous",
      "Empathetic",
    ],
    selectedTone: "Formal",
    messages: [],
  },
  reducers: {
    changeTone: (state, action) => {
      state.selectedTone = action.payload;
    },
    addMessage: (state, action) => {
      let messages = new Array(...state.messages);
      let chat = {
        text: action.payload.message,
        ai: action.payload.ai,
        type: "text",
        time: Date.now(),
      };
      messages.push(chat);
      state.messages = messages;
    },
  },
});

export const { addMessage, changeTone } = AiChatBotSlice.actions;
export default AiChatBotSlice.reducer;
