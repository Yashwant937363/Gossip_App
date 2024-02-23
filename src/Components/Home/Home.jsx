import React, { useEffect } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow/ChatWindow";
import { socket } from "../../store/socket";
import SideBar from "./Sidebar/SideBar";

export default function Home() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <div className="home">
      <SideBar></SideBar>
      {openedchat ? (
        <ChatWindow />
      ) : (
        <div className="closedchat">Click on Chat to Open The Chat</div>
      )}
    </div>
  );
}
