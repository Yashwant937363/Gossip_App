import React, { useEffect, useRef, useState } from "react";
import SideBar from "../Home/Sidebar/SideBar";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Robot } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, changeTone } from "../../store/slices/AIChatBotSlice";
import MessageBar from "../Home/ChatWindow/MessageBar";
import { sendChatBotPrompt } from "../../socket/ai";
import ReceivedChat from "../Home/ChatWindow/Received";
import SendChat from "../Home/ChatWindow/SendChat";
import "./ChatBot.css";

export default function ChatBot() {
  const dispatch = useDispatch();
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const isLogin = useSelector((state) => state.user.isLogin);
  const [animation, setAnimation] = useState({ animationName: "fadein" });
  const tones = useSelector((state) => state.chatbot.tones);
  const tone = useSelector((state) => state.chatbot.selectedTone);
  const messages = useSelector((state) => state.chatbot.messages);
  const uid = useSelector((state) => state.user.uid);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    setAnimation({});
    if (window.innerWidth <= 600) {
      setTimeout(() => setAnimation({ animationName: "scalein" }), 0);
    } else {
      setTimeout(() => setAnimation({ animationName: "fadein" }), 0);
    }
  }, [openedchat]);
  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, []);
  const submitMessage = async (message) => {
    dispatch(addMessage({ message, ai: false }));
    const response = await sendChatBotPrompt({ tone, message, uid });
    console.log(response);
    dispatch(addMessage({ message: response.response.content, ai: true }));
  };
  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };
    setTimeout(() => {
      scrollToBottom();
    }, [0]);
    console.log(messages);
  }, [messages]);
  return (
    <div className="home chatbot">
      <SideBar></SideBar>

      <div className="chatwindow" style={animation}>
        <div className="profilebar">
          <ChevronLeft
            className="arrowlefticon"
            onClick={() => navigate("/")}
          ></ChevronLeft>
          <div className="outerimg">
            <div className="personfillicon">
              <Robot></Robot>
            </div>
          </div>
          <div className="profilebarusername">
            <div>ChatBot</div>
          </div>
          <div className="callicons">
            <select
              value={tone}
              onChange={(e) => dispatch(changeTone(e.target.value))}
              className="tones"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="chatcontainer" ref={containerRef}>
          {messages.map((value, index) => {
            if (value.ai) {
              return (
                <ReceivedChat
                  key={index}
                  message={value.text}
                  time={value.time}
                />
              );
            } else {
              return (
                <SendChat
                  key={index}
                  message={value.text}
                  time={value.time}
                  status="chatbot"
                ></SendChat>
              );
            }
            return null;
          })}
        </div>
        <MessageBar submitMessage={submitMessage}></MessageBar>
      </div>
    </div>
  );
}
