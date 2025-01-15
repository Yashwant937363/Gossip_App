import React, { useEffect, useState } from "react";
import {
  CameraVideoFill,
  ChevronLeft,
  PersonFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import "./ChatWindow.css";
import { useDispatch, useSelector } from "react-redux";
import { changeOpenedChat } from "../../../store/slices/UISlice";
import { setSeenMessages } from "../../../store/slices/ChatSlice";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import MessageBar from "./MessageBar";
import ChatContainer from "./ChatContainer";
import { seenMessages, sendMessage, socket } from "../../../socket/main";
import {
  initializeVideoCall,
  setChannel,
} from "../../../store/slices/CallSlice";
import { sendOutgoingVideoCall } from "../../../socket/call";
import { motion } from "motion/react";

export default function ChatWindow(props) {
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const chats = useSelector((state) => state.chat.chats);

  const submitMessage = async (message) => {
    if (message.trim !== "") {
      const touid = openedchat.uid;
      await sendMessage({ fromuid, touid, message, dispatch, type: "text" });
    } else {
      dispatch(setErrorMsgUser("Cannot Send Empty Message"));
    }
  };
  const [animation, setAnimation] = useState({ animationName: "fadein" });
  const navigate = useNavigate();
  const { uid } = useParams();
  const friends = useSelector((state) => state.chat.friends);

  const clearOpenedChat = () => {
    dispatch(changeOpenedChat(false));
    navigate("/chat");
  };

  const handleVideoCall = async () => {
    sendOutgoingVideoCall({ fromuid: fromuid, touid: openedchat.uid });
    dispatch(initializeVideoCall({ type: "video", caller: openedchat }));
    setChannel(fromuid);
  };

  const handleAudioCall = async () => {};

  useEffect(() => {
    setAnimation({});
    if (window.innerWidth <= 600) {
      setTimeout(() => setAnimation({ animationName: "scalein" }), 0);
    } else {
      setTimeout(() => setAnimation({ animationName: "fadein" }), 0);
    }
  }, [openedchat]);
  useEffect(() => {
    const touid = uid;
    const messages = new Array(...chats);
    const lastIndex = messages
      .reverse()
      .findIndex((message) => message.Receiver_ID === fromuid);

    if (lastIndex !== -1) {
      const lastMessage = messages[lastIndex];
      console.log(lastMessage);
      if (lastMessage.seen === false) {
        console.log(`fromuid: ${fromuid}, touid: ${touid}`);
        seenMessages({ fromuid: touid, touid: fromuid });
        dispatch(setSeenMessages(fromuid));
      }
    }
  }, [chats]);

  useEffect(() => {
    const index = friends.findIndex((friend) => friend.uid === uid);
    if (index > -1) {
      dispatch(changeOpenedChat(friends[index]));
    } else {
      dispatch(
        changeOpenedChat({
          uid: "chatbot",
          username: "ChatBot",
          profile: "",
          online: true,
        })
      );
    }
    if (openedchat) {
      const touid = fromuid;
      seenMessages({ fromuid: uid, touid: touid });
    }
    return () => {
      dispatch(changeOpenedChat(false));
    };
  }, [uid]);
  return (
    <>
      <div className="chatwindow" style={animation}>
        <div className="profilebar">
          <motion.span whileTap={{ translateX: -5 }}>
            <ChevronLeft
              className="arrowlefticon"
              onClick={clearOpenedChat}
            ></ChevronLeft>
          </motion.span>
          <div className="outerimg">
            {openedchat?.profile !== "" ? (
              <img
                className="chatprofileimg"
                src={openedchat?.profile}
                alt=""
              />
            ) : (
              <div className="personfillicon">
                <PersonFill></PersonFill>
              </div>
            )}
          </div>
          <div className="profilebarusername">
            <div>{openedchat.username}</div>
          </div>
          <div className="callicons">
            <CameraVideoFill className="callicon" onClick={handleVideoCall} />
            <TelephoneFill className="callicon" onClick={handleAudioCall} />
          </div>
        </div>
        <ChatContainer></ChatContainer>
        <MessageBar submitMessage={submitMessage}></MessageBar>
      </div>
      <Outlet />
    </>
  );
}
