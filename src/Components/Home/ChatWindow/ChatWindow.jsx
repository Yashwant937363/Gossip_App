import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, PersonFill, SendFill, X } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import "./ChatWindow.css";
import SendChat from "./SendChat";
import ReceivedChat from "./Received";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../store/socket";
import { changeOpenedChat } from "../../../store/slices/UISlice";

export default function ChatWindow(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm();
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const chats = useSelector((state) => state.chat.chats);
  const [userchat, setUserChats] = useState(new Array());
  const containerRef = useRef(null);
  const [animation, setAnimation] = useState({ animationName: "fadein" });

  const submitMessage = async (data) => {
    const touid = openedchat.uid;
    const message = data.message;
    await sendMessage({ fromuid, touid, message, dispatch });
    resetField("message");
  };

  const clearOpenedChat = () => {
    dispatch(changeOpenedChat(false));
  };

  useEffect(() => {
    let newUserChats = new Array();
    if (chats.length !== 0) {
      chats.map((item) => {
        if (
          item.Sender_ID === openedchat.uid ||
          item.Receiver_ID === openedchat.uid
        ) {
          newUserChats.push(item);
        }
      });
    }
    setUserChats(newUserChats);
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };
    setTimeout(() => {
      scrollToBottom();
    }, [0]);
  }, [chats, openedchat]);

  useEffect(() => {
    setAnimation({});
    if (window.innerWidth <= 600) {
      setTimeout(() => setAnimation({ animationName: "scalein" }), 0);
    } else {
      setTimeout(() => setAnimation({ animationName: "fadein" }), 0);
    }
  }, [openedchat]);

  return (
    <div className="chatwindow" style={animation}>
      <div className="profilebar">
        <ArrowLeft
          className="arrowlefticon"
          onClick={clearOpenedChat}
        ></ArrowLeft>
        <div className="outerimg">
          {openedchat.profile !== "" ? (
            <img className="chatprofileimg" src={openedchat.profile} alt="" />
          ) : (
            <div className="personfillicon">
              <PersonFill></PersonFill>
            </div>
          )}
        </div>
        <div className="listItemtext">
          <div>{openedchat.username}</div>
        </div>
      </div>
      <div className="chatcontainer" ref={containerRef}>
        {userchat.length !== 0 ? (
          userchat.map((item, index) =>
            item.Sender_ID === fromuid ? (
              <SendChat
                key={index}
                message={item.text}
                status={item.seen}
                time={item.createdAt}
              />
            ) : (
              <ReceivedChat
                key={index}
                message={item.text}
                time={item.createdAt}
              />
            )
          )
        ) : (
          <div>No Messages</div>
        )}
      </div>

      <form className="messagefield" onSubmit={handleSubmit(submitMessage)}>
        <input
          {...register("message", { required: "Empty Message Cannot be Send" })}
        />
        <button type="submit">
          <SendFill></SendFill>
        </button>
      </form>
    </div>
  );
}
