import { createAsyncThunk, createSlice, original } from "@reduxjs/toolkit";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const getPath = (route) => {
  return `${SERVER_URL}/api/chat/${route}`;
};

export const fetchFriends = createAsyncThunk(
  "fetchFriends",
  async ({ authtoken }) => {
    try {
      const response = await fetch(getPath("getFriends"), {
        method: "POST",
        headers: { authtoken },
      });
      const data = await response.json();
      return {
        data: data,
        status: response.status,
      };
    } catch (error) {
      console.log("Error while fetching friends : ", error);
    }
  }
);

export const fetchChats = createAsyncThunk(
  "fetchChats",
  async ({ authtoken }) => {
    try {
      const response = await fetch(getPath(""), {
        method: "GET",
        headers: { authtoken },
      });
      const data = await response.json();
      return {
        data: data,
        status: response.status,
      };
    } catch (error) {
      console.log("Error while fetching friends : ", error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    friends: new Array(),
    chats: new Array(),
    pending: false,
  },
  reducers: {
    setFriendOnline: (state, action) => {
      let copyobject;
      const copyFriends = new Array(...original(state.friends));
      const newFriends = copyFriends.map((item) => {
        copyobject = {
          uid: item.uid,
          username: item.username,
          profile: item.profile,
          online: item.online,
        };
        if (item?.uid === action.payload) {
          copyobject.online = true;
        }
        return copyobject;
      });
      state.friends = [...newFriends];
    },
    setFriendOffline: (state, action) => {
      let copyobject;
      const copyFriends = new Array(...original(state.friends));
      const newFriends = copyFriends.map((item) => {
        copyobject = {
          uid: item.uid,
          username: item.username,
          profile: item.profile,
          online: item.online,
        };
        if (item?.uid === action.payload) {
          copyobject.online = false;
        }
        return copyobject;
      });
      state.friends = [...newFriends];
    },
    addChat: (state, action) => {
      state.chats = [...original(state.chats), action.payload];
    },
    addFriend: (state, action) => {
      state.friends = [...original(state.friends), action.payload];
    },
    setSeenMessages: (state, action) => {
      const uid = action.payload;
      let copyobject;
      const copyChats = new Array(...original(state.chats));
      const newChats = copyChats.map((item, index) => {
        copyobject = {
          Sender_ID: item.Sender_ID,
          Receiver_ID: item.Receiver_ID,
          text: item.text,
          seen: item.seen,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        if (copyobject.Receiver_ID === uid) {
          copyobject.seen = true;
        }
        return copyobject;
      });
      state.chats = new Array(...newChats);
    },
    setReceivedMessages: (state, action) => {
      const uid = action.payload;
      let copyobject;
      const copyChats = new Array(...original(state.chats));
      const newChats = copyChats.map((item, index) => {
        copyobject = {
          Sender_ID: item.Sender_ID,
          Receiver_ID: item.Receiver_ID,
          text: item.text,
          seen: item.seen,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        if (copyobject.Receiver_ID === uid) {
          copyobject.seen = false;
        }
        return copyobject;
      });
      state.chats = new Array(...newChats);
    },
  },
  extraReducers: (builder) => {
    //Fetching Friends and Chats
    builder.addCase(fetchFriends.pending, (state, action) => {
      state.pending = true;
    });
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      const { data, status } = action.payload;
      const { msg, friends, chats } = data;
      let copyArray = [];
      if (status >= 200 && status < 300) {
        const updatedFriends = new Array(...friends);
        updatedFriends.map((item) => {
          if (item.profile !== "") {
            if (!item.profile.startsWith(SERVER_URL)) {
              item.profile = item.profile;
            }
          }
          copyArray.push(item);
        });
        state.friends = [...copyArray];
        state.chats = chats;
      }
      state.pending = false;
    });

    builder.addCase(fetchFriends.rejected, (state, action) => {
      console.log(action.payload);
      state.pending = false;
    });
  },
});

export const {
  setFriendOnline,
  setFriendOffline,
  addChat,
  addFriend,
  setSeenMessages,
  setReceivedMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
