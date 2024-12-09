import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    caller: null,
    channel: "",
    callInitialize: false,
    type: null,
  },
  reducers: {
    initializeVideoCall: (state, action) => {
      const { caller, type } = action.payload;
      state.caller = caller;
      state.callInitialize = true;
      state.type = type;
    },
    setChannel: (state, action) => {
      state.channel = action.payload;
    },
    setCallType: (state, action) => {
      state.type = action.payload;
    },
    cancelVideoCall: (state, action) => {
      state.caller = null;
      state.callInitialize = false;
      state.type = null;
    },
  },
});

export const { initializeVideoCall, cancelVideoCall, setChannel, setCallType } =
  callSlice.actions;
export default callSlice.reducer;
