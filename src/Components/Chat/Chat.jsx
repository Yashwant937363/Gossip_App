import React, { useEffect } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow/ChatWindow";
import SideBar from "./Sidebar/SideBar";
import CallWindow from "./ChatWindow/Call/Call";
import { socket } from "../../socket/main";

export default function Chat() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const isCallStarted = useSelector((state) => state.call.isCallStarted);
  const navigate = useNavigate();
  const { uid } = useParams();
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
    <div className="chat">
      <SideBar></SideBar>
      {uid ? (
        <Outlet></Outlet>
      ) : (
        <div className="closedchat">Click on Chat to Open The Chat</div>
      )}
      {isCallStarted && <CallWindow />}
    </div>
  );
}