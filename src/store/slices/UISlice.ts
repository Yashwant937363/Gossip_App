import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  openedchat: any;
  previousPath: string;
  isEditorOpen: boolean;
  warningmsg: string;
}

const initialState: UIState = {
  openedchat: false,
  previousPath: "/chat",
  isEditorOpen: false,
  warningmsg: "",
};

const UISlice = createSlice({
  name: "UIState",
  initialState,
  reducers: {
    changeOpenedChat: (state, action: PayloadAction<any>) => {
      state.openedchat = action.payload;
    },
    changePreviousPath: (state, action: PayloadAction<string>) => {
      state.previousPath = action.payload;
    },
    setEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditorOpen = action.payload;
    },
    setWarningMsg: (state, action: PayloadAction<string>) => {
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
