import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "UIState",
  initialState: {
    openedchat: false,
    previousPath: "/",
  },
  reducers: {
    changeOpenedChat: (state, action) => {
      state.openedchat = action.payload;
    },
    changePreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
  },
});

export const { changeOpenedChat, changePreviousPath } = UISlice.actions;
export default UISlice.reducer;
