import { configureStore } from "@reduxjs/toolkit";
import UIReducer from "./slices/UISlice";
import UserSlice from "./slices/UserSlice";
import ChatReducer from "./slices/ChatSlice";
import CallSlice from "./slices/CallSlice";

export const store = configureStore({
  reducer: {
    UIState: UIReducer,
    user: UserSlice,
    chat: ChatReducer,
    call: CallSlice,
  },
});
