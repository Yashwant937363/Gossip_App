import { configureStore } from "@reduxjs/toolkit";
import UIReducer from "./slices/UISlice";
import UserSlice from "./slices/UserSlice";
import ChatReducer from "./slices/ChatSlice";
import ThemeSlice from "./slices/ThemeSlice";
import AIChatBotSlice from "./slices/AIChatBotSlice";
import callSlice from "./slices/CallSlice"
export const store = configureStore({
  reducer: {
    UIState: UIReducer,
    user: UserSlice,
    chat: ChatReducer,
    call: callSlice,
    theme: ThemeSlice,
    chatbot: AIChatBotSlice,
  },
});
