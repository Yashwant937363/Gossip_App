import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "UIState",
  initialState: {
    openedchat: false,
    previousPath: "/chat",
    isEditorOpen: false,
    warningmsg: "",
  },
  reducers: {
    changeOpenedChat: (state, action) => {
      state.openedchat = action.payload;
    },
    changePreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
    setEditorOpen: (state, action) => {
      state.isEditorOpen = action.payload;
    },
    setWarningMsg: (state, action) => {
      state.warningmsg = action.payload;
    },
  },
});

export const {
  changeOpenedChat,
  changePreviousPath,
  setEditorOpen,
  setWarningMsg,
} = UISlice.actions;
export default UISlice.reducer;
