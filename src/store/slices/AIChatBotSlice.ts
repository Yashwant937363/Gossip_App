import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AIChatMessage } from "../../types";

export interface AIChatBotState {
  tones: string[];
  selectedTone: string;
  messages: AIChatMessage[];
}

const initialState: AIChatBotState = {
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
};

const AiChatBotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    changeTone: (state, action: PayloadAction<string>) => {
      state.selectedTone = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ message: string; ai: boolean }>
    ) => {
      const chat: AIChatMessage = {
        text: action.payload.message,
        ai: action.payload.ai,
        type: "text",
        time: Date.now(),
      };
      state.messages.push(chat);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, changeTone, clearMessages } = AiChatBotSlice.actions;
export default AiChatBotSlice.reducer;
