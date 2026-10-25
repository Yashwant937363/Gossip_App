import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiGetFriends } from "../../api/client";
import { ChatMessage, Friend, TranslatedTextItem } from "../../types";

export interface ChatState {
  friends: Friend[];
  chats: ChatMessage[];
  pending: boolean;
}

const initialState: ChatState = {
  friends: [],
  chats: [],
  pending: false,
};

export const fetchFriends = createAsyncThunk(
  "chat/fetchFriends",
  async ({ authtoken }: { authtoken?: string }) => {
    try {
      const data = await apiGetFriends(authtoken);
      return { data, status: 200 };
    } catch (error: any) {
      console.log("Error while fetching friends: ", error);
      return {
        data: { error: error.message },
        status: error.response?.status || 500,
      };
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setFriendOnline: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.friends = state.friends.map((item) => {
        if (item?.uid === uid) {
          return { ...item, online: true };
        }
        return item;
      });
    },
    setFriendOffline: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.friends = state.friends.map((item) => {
        if (item?.uid === uid) {
          return { ...item, online: false };
        }
        return item;
      });
    },
    addChat: (state, action: PayloadAction<ChatMessage>) => {
      state.chats.push(action.payload);
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      const exists = state.friends.some((f) => f.uid === action.payload.uid);
      if (!exists) {
        state.friends.push(action.payload);
      }
    },
    setSeenMessages: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.chats = state.chats.map((item) => {
        if (item.Receiver_ID === uid) {
          return { ...item, seen: true };
        }
        return item;
      });
    },
    setReceivedMessages: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.chats = state.chats.map((item) => {
        if (item.Receiver_ID === uid && item.seen !== true) {
          return { ...item, seen: false };
        }
        return item;
      });
    },
    setMultipleTranslatedMessages: (
      state,
      action: PayloadAction<{
        messages: Array<{ id: string; translatedText: string }>;
        language: string;
      }>
    ) => {
      const { messages, language } = action.payload;
      state.chats = state.chats.map((chat) => {
        const translatedItem = messages.find(
          (m) => m.id === chat._id?.toString()
        );
        if (translatedItem) {
          const existingList = chat.translatedText || [];
          const filtered = existingList.filter((t) => t.language !== language);
          return {
            ...chat,
            translatedText: [
              ...filtered,
              { language, translatedText: translatedItem.translatedText },
            ],
          };
        }
        return chat;
      });
    },
    setSingleTranslatedMessage: (
      state,
      action: PayloadAction<{
        id: string;
        translatedText: string;
        language: string;
      }>
    ) => {
      const { id, translatedText, language } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat._id === id) {
          const existingList = chat.translatedText || [];
          return {
            ...chat,
            translatedText: [
              ...existingList.filter((t) => t && t.language !== language),
              { translatedText, language },
            ],
          };
        }
        return chat;
      });
    },
    clearChat: (state) => {
      state.friends = [];
      state.chats = [];
      state.pending = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFriends.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      const { data, status } = action.payload;
      if (status >= 200 && status < 300 && data) {
        const { friends = [], chats = [] } = data;
        state.friends = friends;
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
  clearChat,
  setMultipleTranslatedMessages,
  setSingleTranslatedMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
