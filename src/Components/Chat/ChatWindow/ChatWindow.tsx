import React, { useEffect } from "react";
import {
  CameraVideoFill,
  ChevronLeft,
  PersonFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { changeOpenedChat } from "../../../store/slices/UISlice";
import { setSeenMessages } from "../../../store/slices/ChatSlice";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import MessageBar from "./MessageBar";
import ChatContainer from "./ChatContainer";
import { seenMessages, sendMessage } from "../../../socket/main";
import {
  initializeVideoCall,
  setChannel,
} from "../../../store/slices/CallSlice";
import { sendOutgoingVideoCall } from "../../../socket/call";
import { RootState, AppDispatch } from "../../../store/store";

export default function ChatWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const fromuid = useSelector((state: RootState) => state.user.uid);
  const openedchat = useSelector((state: RootState) => state.UIState.openedchat);
  const chats = useSelector((state: RootState) => state.chat.chats);
  const friends = useSelector((state: RootState) => state.chat.friends);
  const navigate = useNavigate();
  const { uid } = useParams<{ uid: string }>();

  const submitMessage = async (message: string) => {
    if (!message || message.trim() === "" || !openedchat?.uid) return;
    const touid = openedchat.uid;
    await sendMessage({
      fromuid,
      touid,
      message,
      dispatch,
      type: "text",
    });
  };

  const clearOpenedChat = () => {
    dispatch(changeOpenedChat(false));
    navigate("/chat/");
  };

  const handleVideoCall = () => {
    if (!openedchat?.uid) return;
    sendOutgoingVideoCall({ fromuid, touid: openedchat.uid });
    dispatch(initializeVideoCall({ type: "video", caller: openedchat }));
    dispatch(setChannel(fromuid));
  };

  useEffect(() => {
    if (!uid) return;
    const friend = friends.find((f) => f.uid === uid);
    if (friend) {
      dispatch(changeOpenedChat(friend));
    }

    if (fromuid && uid) {
      seenMessages({ fromuid: uid, touid: fromuid });
    }

    return () => {
      dispatch(changeOpenedChat(false));
    };
  }, [uid, friends, fromuid, dispatch]);

  useEffect(() => {
    if (chats.length > 0 && fromuid && uid) {
      const lastIncoming = [...chats]
        .reverse()
        .find((m) => m.Receiver_ID === fromuid && m.Sender_ID === uid);

      if (lastIncoming && !lastIncoming.seen) {
        seenMessages({ fromuid: uid, touid: fromuid });
        dispatch(setSeenMessages(fromuid));
      }
    }
  }, [chats, fromuid, uid, dispatch]);

  if (!openedchat) {
    return (
      <div className="flex items-center justify-center h-full opacity-60 text-sm">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-45px)] w-full bg-bg5 text-textColor relative overflow-hidden animate-fadein">
      <Outlet />

      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg10/90 backdrop-blur-md border-b border-bg20 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearOpenedChat}
            className="md:hidden p-1 rounded-lg hover:bg-bg20 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="text-xl" />
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-bg15 border border-bg20 flex items-center justify-center">
            {openedchat.profile ? (
              <img
                src={openedchat.profile}
                alt={openedchat.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <PersonFill className="text-xl text-textColor opacity-70" />
            )}
          </div>

          <div>
            <h2 className="font-bold text-sm tracking-wide text-themeColor">
              {openedchat.username}
            </h2>
            <span
              className={`text-[11px] font-medium ${
                openedchat.online ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              {openedchat.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Video Call button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVideoCall}
            className="p-2.5 rounded-xl bg-bg15 hover:bg-themeColor hover:text-themeMode transition-all cursor-pointer shadow-sm"
            title="Start Video Call"
          >
            <CameraVideoFill className="text-base" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ChatContainer />

      {/* Input */}
      <div className="p-3 bg-bg10/90 border-t border-bg20 backdrop-blur-md">
        <MessageBar submitMessage={submitMessage} />
      </div>
    </div>
  );
}
