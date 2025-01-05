import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "UIState",
  initialState: {
    openedchat: false,
    previousPath: "/chat",
    isEditorOpen: false,
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
  },
});

export const { changeOpenedChat, changePreviousPath, setEditorOpen } =
  UISlice.actions;
export default UISlice.reducer;
