import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CallState {
  caller: any | null;
  channel: string;
  callInitialize: boolean;
  type: string | null;
}

const initialState: CallState = {
  caller: null,
  channel: "",
  callInitialize: false,
  type: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    initializeVideoCall: (
      state,
      action: PayloadAction<{ caller: any; type: string }>
    ) => {
      const { caller, type } = action.payload;
      state.caller = caller;
      state.callInitialize = true;
      state.type = type;
    },
    setChannel: (state, action: PayloadAction<string>) => {
      state.channel = action.payload;
    },
    setCallType: (state, action: PayloadAction<string | null>) => {
      state.type = action.payload;
    },
    cancelVideoCall: (state) => {
      state.caller = null;
      state.callInitialize = false;
      state.type = null;
    },
  },
});

export const { initializeVideoCall, cancelVideoCall, setChannel, setCallType } =
  callSlice.actions;
export default callSlice.reducer;
