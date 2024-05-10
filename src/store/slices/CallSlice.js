import { createSlice } from "@reduxjs/toolkit";

const CallSlice = createSlice({
  name: "call",
  initialState: {
    type: null,
    isIncoming: false,
    isCallStarted: false,
    isConnected: false,
    isCallAccepted: false,
    fromuid: "",
    offer: null,
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setCallStarted: (state, action) => {
      state.isCallStarted = action.payload;
    },
    setCallConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setIncomingCall: (state, action) => {
      state.isIncoming = action.payload;
    },
    setFromUid: (state, action) => {
      state.fromuid = action.payload;
    },
    setOffer: (state, action) => {
      state.offer = action.payload;
    },
    setCallAccepted: (state, action) => {
      state.isCallAccepted = action.payload;
    },
    clearCalls: (state) => {
      state.isCallStarted = false;
      state.stream = null;
      state.type = null;
      state.isConnected = false;
      state.fromuid = "";
      state.offer = null;
      state.isIncoming = false;
    },
  },
});

export default CallSlice.reducer;
export const {
  setType,
  setCallStarted,
  setCallConnected,
  setFromUid,
  setOffer,
  setIncomingCall,
  setCallAccepted,
  clearCalls,
} = CallSlice.actions;
